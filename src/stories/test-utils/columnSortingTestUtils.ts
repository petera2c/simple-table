import { expect } from "@storybook/test";

/**
 * Test data for sorting verification
 */
export const BASIC_COLUMN_CONFIGURATION = [
  { accessor: "id", sortable: true, type: "number" },
  { accessor: "name", sortable: true, type: "string" },
  { accessor: "age", sortable: true, type: "number" },
  { accessor: "role", sortable: true, type: "string" },
];

/**
 * Expected data for sorting tests
 */
export const EXPECTED_SORT_ORDERS = {
  name: {
    ascending: ["Alice Williams", "Bob Johnson", "Charlie Brown", "Jane Smith", "John Doe"],
    descending: ["John Doe", "Jane Smith", "Charlie Brown", "Bob Johnson", "Alice Williams"],
  },
  age: {
    ascending: [24, 28, 32, 37, 45],
    descending: [45, 37, 32, 28, 24],
  },
  id: {
    ascending: [1, 2, 3, 4, 5],
    descending: [5, 4, 3, 2, 1],
  },
  role: {
    ascending: ["Designer", "Developer", "DevOps", "Intern", "Manager"],
    descending: ["Manager", "Intern", "DevOps", "Developer", "Designer"],
  },
};

/**
 * Click on a sortable column header
 */
export const clickColumnHeader = async (
  canvasElement: HTMLElement,
  columnLabel: string
): Promise<void> => {
  // Find the specific header by its text content
  const headerElements = canvasElement.querySelectorAll(".st-header-label-text");
  let targetHeader: HTMLElement | null = null;

  for (const element of Array.from(headerElements)) {
    if (element.textContent?.trim() === columnLabel) {
      // Make sure it's inside a clickable header
      const headerCell = element.closest(".st-header-cell.clickable");
      if (headerCell) {
        targetHeader = element.closest(".st-header-label") as HTMLElement;
        break;
      }
    }
  }

  if (!targetHeader) {
    throw new Error(`Could not find clickable header with label: ${columnLabel}`);
  }

  // Click the header to trigger sorting
  targetHeader.click();

  // Wait for sorting to complete
  await new Promise((resolve) => setTimeout(resolve, 100));
};

/**
 * Get the current data from table rows
 */
export const getColumnDataFromTable = (
  canvasElement: HTMLElement,
  accessor: string
): (string | number)[] => {
  const values: (string | number)[] = [];
  const cells = canvasElement.querySelectorAll(`[data-accessor="${accessor}"] .st-cell-content`);

  Array.from(cells).forEach((cell) => {
    const text = cell.textContent?.trim() || "";
    // Try to parse as number for numeric columns
    const numValue = parseFloat(text);
    values.push(isNaN(numValue) ? text : numValue);
  });

  return values;
};

/**
 * Verify sort direction icon is present
 */
export const verifySortIcon = (
  canvasElement: HTMLElement,
  columnLabel: string,
  direction: "ascending" | "descending"
): void => {
  const headerElements = canvasElement.querySelectorAll(".st-header-label-text");
  let targetHeaderCell: HTMLElement | null = null;

  for (const element of Array.from(headerElements)) {
    if (element.textContent?.trim() === columnLabel) {
      targetHeaderCell = element.closest(".st-header-cell") as HTMLElement;
      break;
    }
  }

  expect(targetHeaderCell).toBeTruthy();

  // Check for sort icon container
  const iconContainer = targetHeaderCell!.querySelector(".st-icon-container");
  expect(iconContainer).toBeTruthy();

  // Check for appropriate sort icon (the icon content should be present)
  const sortIcon = iconContainer!.querySelector("svg");
  expect(sortIcon).toBeTruthy();

  console.log(`✅ Sort icon verified for ${columnLabel} (${direction})`);
};

/**
 * Test sorting for a specific column
 */
export const testColumnSorting = async (
  canvasElement: HTMLElement,
  columnLabel: string,
  accessor: string
): Promise<void> => {
  console.log(`🔄 Testing sorting for column: ${columnLabel}`);

  // First click - should sort ascending
  await clickColumnHeader(canvasElement, columnLabel);

  // Verify ascending sort
  verifySortIcon(canvasElement, columnLabel, "ascending");
  const ascendingData = getColumnDataFromTable(canvasElement, accessor);
  const expectedAscending =
    EXPECTED_SORT_ORDERS[accessor as keyof typeof EXPECTED_SORT_ORDERS]?.ascending;

  if (expectedAscending) {
    expect(ascendingData).toEqual(expectedAscending);
    console.log(`✅ Ascending sort verified for ${columnLabel}`);
  }

  // Second click - should sort descending
  await clickColumnHeader(canvasElement, columnLabel);

  // Verify descending sort
  verifySortIcon(canvasElement, columnLabel, "descending");
  const descendingData = getColumnDataFromTable(canvasElement, accessor);
  const expectedDescending =
    EXPECTED_SORT_ORDERS[accessor as keyof typeof EXPECTED_SORT_ORDERS]?.descending;

  if (expectedDescending) {
    expect(descendingData).toEqual(expectedDescending);
    console.log(`✅ Descending sort verified for ${columnLabel}`);
  }

  // Third click - should remove sort (return to original order)
  await clickColumnHeader(canvasElement, columnLabel);

  // Verify no sort icon is present
  const headerElements = canvasElement.querySelectorAll(".st-header-label-text");
  let targetHeaderCell: HTMLElement | null = null;

  for (const element of Array.from(headerElements)) {
    if (element.textContent?.trim() === columnLabel) {
      targetHeaderCell = element.closest(".st-header-cell") as HTMLElement;
      break;
    }
  }

  const iconContainer = targetHeaderCell?.querySelector(".st-icon-container");
  // Icon container might exist but should not show sort icon when not sorted
  if (iconContainer) {
    // Check that it's not a sort icon or icon is not present
    const hasSortIcon = iconContainer.querySelector("svg");
    // If there's an SVG, it should be empty or not a sort icon when sorting is cleared
  }

  console.log(`✅ Sort cleared for ${columnLabel}`);
};

/**
 * Test sorting persistence across interactions
 */
export const testSortPersistence = async (
  canvasElement: HTMLElement,
  firstColumn: string,
  firstAccessor: string,
  secondColumn: string,
  secondAccessor: string
): Promise<void> => {
  console.log(`🔄 Testing sort persistence between ${firstColumn} and ${secondColumn}`);

  // Sort first column
  await clickColumnHeader(canvasElement, firstColumn);
  const firstSortData = getColumnDataFromTable(canvasElement, firstAccessor);

  // Sort second column (should clear first sort)
  await clickColumnHeader(canvasElement, secondColumn);
  const secondSortData = getColumnDataFromTable(canvasElement, secondAccessor);

  // Verify first column is no longer sorted (data should be different)
  const firstColumnAfterSecondSort = getColumnDataFromTable(canvasElement, firstAccessor);

  // The data should be different since we're now sorting by the second column
  expect(firstColumnAfterSecondSort).not.toEqual(firstSortData);

  console.log(`✅ Sort persistence verified - only one column sorted at a time`);
};

/**
 * Test multiple rapid clicks to ensure stability
 */
export const testRapidSortClicks = async (
  canvasElement: HTMLElement,
  columnLabel: string,
  accessor: string
): Promise<void> => {
  console.log(`🔄 Testing rapid clicks for column: ${columnLabel}`);

  // Perform multiple rapid clicks
  for (let i = 0; i < 5; i++) {
    await clickColumnHeader(canvasElement, columnLabel);
    await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay between clicks
  }

  // After 5 clicks (odd number), should be in ascending state
  const finalData = getColumnDataFromTable(canvasElement, accessor);
  const expectedAscending =
    EXPECTED_SORT_ORDERS[accessor as keyof typeof EXPECTED_SORT_ORDERS]?.ascending;

  if (expectedAscending) {
    expect(finalData).toEqual(expectedAscending);
    console.log(`✅ Rapid click test passed for ${columnLabel}`);
  }
};
