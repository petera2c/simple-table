import { expect } from "@storybook/test";

// Assertion helpers
export const getCellElement = (rowIndex: number, accessor: string): Element | null => {
  return document.querySelector(`[data-row-index="${rowIndex}"][data-accessor="${accessor}"]`);
};

export const getCellValue = (rowIndex: number, accessor: string): string | null => {
  const cell = getCellElement(rowIndex, accessor);
  if (!cell) return null;

  const contentSpan = cell.querySelector(".st-cell-content span");
  return contentSpan?.textContent || null;
};

export const hasCellUpdatingClass = (rowIndex: number, accessor: string): boolean => {
  const cell = getCellElement(rowIndex, accessor);
  return cell?.classList.contains("st-cell-updating") || false;
};

/**
 * Wait for LiveUpdatesExample component to mount
 */
export const waitForLiveUpdatesComponent = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const tableContainer = document.querySelector(".simple-table-root");
  expect(tableContainer).toBeTruthy();

  const cells = document.querySelectorAll("[data-row-index]");
  expect(cells.length).toBeGreaterThan(0);
};

/**
 * Capture price values from multiple rows
 */
export const capturePriceValues = (): string[] => {
  const prices = [];
  for (let i = 0; i < 3; i++) {
    const price = getCellValue(i, "price");
    if (price) {
      prices.push(price);
    }
  }
  expect(prices.length).toBeGreaterThanOrEqual(2); // Ensure we have at least 2 price values
  return prices;
};

/**
 * Wait for and detect price changes
 */
export const waitForPriceChanges = async (
  initialPrices: string[],
  timeoutMs: number = 10000
): Promise<void> => {
  const startTime = Date.now();
  let changeDetected = false;

  while (Date.now() - startTime < timeoutMs && !changeDetected) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentPrices = capturePriceValues();

    // Check if any price has changed
    for (let i = 0; i < Math.min(initialPrices.length, currentPrices.length); i++) {
      if (initialPrices[i] !== currentPrices[i]) {
        changeDetected = true;

        break;
      }
    }
  }

  expect(changeDetected).toBe(true);
};

/**
 * Test that multiple price changes occur over time
 */
export const testMultiplePriceChanges = async (): Promise<void> => {
  const priceSnapshots: string[][] = [];
  const snapshotInterval = 3000; // Take snapshot every 3 seconds
  const totalSnapshots = 4; // Take 4 snapshots over 12 seconds

  // Take initial snapshot
  priceSnapshots.push(capturePriceValues());

  // Take additional snapshots
  for (let i = 1; i < totalSnapshots; i++) {
    await new Promise((resolve) => setTimeout(resolve, snapshotInterval));
    priceSnapshots.push(capturePriceValues());
  }

  // Verify that prices changed between snapshots
  let changesDetected = 0;
  for (let snapshot = 1; snapshot < priceSnapshots.length; snapshot++) {
    const previousPrices = priceSnapshots[snapshot - 1];
    const currentPrices = priceSnapshots[snapshot];

    for (let row = 0; row < Math.min(previousPrices.length, currentPrices.length); row++) {
      if (previousPrices[row] !== currentPrices[row]) {
        changesDetected++;
        break; // At least one change in this snapshot is enough
      }
    }
  }

  // Expect changes in at least 2 out of 3 snapshot intervals
  expect(changesDetected).toBeGreaterThanOrEqual(2);
};

/**
 * Test that flash animations occur when values change
 */
export const testFlashAnimations = async (): Promise<void> => {
  let flashDetected = false;
  const maxChecks = 20;
  let checks = 0;

  while (checks < maxChecks && !flashDetected) {
    // Check for flash animations on price cells
    for (let row = 0; row < 3; row++) {
      if (hasCellUpdatingClass(row, "price")) {
        flashDetected = true;
        break;
      }
    }

    if (!flashDetected) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      checks++;
    }
  }

  expect(flashDetected).toBe(true);
};

/**
 * Test that stock values decrease over time
 */
export const testStockDecrease = async (): Promise<void> => {
  const initialStock = getCellValue(0, "stock");
  expect(initialStock).toBeTruthy();

  // Wait for potential stock changes (stocks decrease every 3 seconds)
  await new Promise((resolve) => setTimeout(resolve, 6000));

  const finalStock = getCellValue(0, "stock");
  expect(finalStock).toBeTruthy();

  // Parse stock values (remove commas if present)
  const initialStockNum = parseInt(initialStock!.replace(/,/g, ""));
  const finalStockNum = parseInt(finalStock!.replace(/,/g, ""));

  // Stock should have decreased or stayed the same (if it was already 0)
  expect(finalStockNum).toBeLessThanOrEqual(initialStockNum);

  // If initial stock was > 0, final should be lower
  if (initialStockNum > 0) {
    expect(finalStockNum).toBeLessThan(initialStockNum);
  }
};

/**
 * Test that sales values increase over time
 */
export const testSalesIncrease = async (): Promise<void> => {
  const initialSales = getCellValue(0, "sales");
  expect(initialSales).toBeTruthy();

  // Wait for potential sales changes (sales increase every 3 seconds)
  await new Promise((resolve) => setTimeout(resolve, 6000));

  const finalSales = getCellValue(0, "sales");
  expect(finalSales).toBeTruthy();

  // Parse sales values (remove commas if present)
  const initialSalesNum = parseInt(initialSales!.replace(/,/g, ""));
  const finalSalesNum = parseInt(finalSales!.replace(/,/g, ""));

  // Sales should have increased
  expect(finalSalesNum).toBeGreaterThan(initialSalesNum);
};

/**
 * Main test function focused on live updates functionality
 */
export const testLiveUpdates = async (canvasElement: HTMLElement): Promise<void> => {
  // Wait for component to mount
  await waitForLiveUpdatesComponent();

  // Test 1: Capture initial prices and wait for changes
  const initialPrices = capturePriceValues();
  await waitForPriceChanges(initialPrices);

  // Test 2: Test multiple price changes over time
  await testMultiplePriceChanges();

  // Test 3: Test flash animations
  await testFlashAnimations();

  // Test 4: Test stock decrease
  await testStockDecrease();

  // Test 5: Test sales increase
  await testSalesIncrease();
};
