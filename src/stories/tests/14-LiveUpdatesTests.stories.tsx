import type { Meta, StoryObj } from "@storybook/react";
import React, { useRef, useEffect, useState } from "react";
import { expect } from "@storybook/test";
import { HeaderObject, SimpleTable, TableRefType } from "../..";

// ============================================================================
// TEST UTILITIES
// ============================================================================

const waitForTable = async (timeout = 5000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const table = document.querySelector(".simple-table-root");
    if (table) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Table did not render within timeout");
};

const getCellElement = (rowIndex: number, accessor: string): Element | null => {
  return document.querySelector(`[data-row-index="${rowIndex}"][data-accessor="${accessor}"]`);
};

const getCellValue = (rowIndex: number, accessor: string): string | null => {
  const cell = getCellElement(rowIndex, accessor);
  if (!cell) return null;

  const contentSpan = cell.querySelector(".st-cell-content span");
  return contentSpan?.textContent || null;
};

const hasCellUpdatingClass = (rowIndex: number, accessor: string): boolean => {
  const cell = getCellElement(rowIndex, accessor);
  return cell?.classList.contains("st-cell-updating") || false;
};

// ============================================================================
// STORYBOOK META
// ============================================================================

const meta: Meta<typeof SimpleTable> = {
  title: "Tests/14 - Live Updates",
  component: SimpleTable,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof SimpleTable>;

// ============================================================================
// TEST COMPONENT
// ============================================================================

const LiveUpdatesTestComponent = () => {
  const tableRef = useRef<TableRefType>(null);

  const headers: HeaderObject[] = [
    { accessor: "id", label: "ID", width: 60, type: "number" },
    { accessor: "product", label: "Product", width: 180, type: "string" },
    {
      accessor: "price",
      label: "Price",
      width: "1fr",
      type: "number",
      valueFormatter: ({ value }) => {
        const price = value;
        if (typeof price === "number") {
          return `$${price.toFixed(2)}`;
        }
        return `$0.00`;
      },
    },
    { accessor: "stock", label: "In Stock", width: 120, type: "number" },
    { accessor: "sales", label: "Sales", width: 120, type: "number" },
  ];

  const [data, setData] = useState([
    {
      id: 1,
      product: "Widget A",
      price: 19.99,
      stock: 42,
      sales: 120,
    },
    {
      id: 2,
      product: "Widget B",
      price: 24.99,
      stock: 28,
      sales: 85,
    },
    {
      id: 3,
      product: "Widget C",
      price: 34.99,
      stock: 15,
      sales: 63,
    },
  ]);

  useEffect(() => {
    // Update prices every 2 seconds
    const priceInterval = setInterval(() => {
      setData((prevData) =>
        prevData.map((row) => ({
          ...row,
          price: Number((Math.random() * 50 + 10).toFixed(2)),
        }))
      );
    }, 2000);

    // Decrease stock every 3 seconds
    const stockInterval = setInterval(() => {
      setData((prevData) =>
        prevData.map((row) => ({
          ...row,
          stock: Math.max(0, row.stock - Math.floor(Math.random() * 5 + 1)),
        }))
      );
    }, 3000);

    // Increase sales every 3 seconds
    const salesInterval = setInterval(() => {
      setData((prevData) =>
        prevData.map((row) => ({
          ...row,
          sales: row.sales + Math.floor(Math.random() * 10 + 1),
        }))
      );
    }, 3000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(stockInterval);
      clearInterval(salesInterval);
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <SimpleTable
        tableRef={tableRef}
        defaultHeaders={headers}
        rows={data}
        getRowId={(params) => String(params.row.id)}
        height="400px"
        cellUpdateFlash={true}
      />
    </div>
  );
};

// ============================================================================
// TEST CASES
// ============================================================================

/**
 * Test 1: Price Changes Detection
 * Tests that price values change over time
 */
export const PriceChangesDetection: Story = {
  render: () => <LiveUpdatesTestComponent />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Wait for component to mount
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Capture initial prices
    const initialPrices: string[] = [];
    for (let i = 0; i < 3; i++) {
      const price = getCellValue(i, "price");
      if (price) {
        initialPrices.push(price);
      }
    }

    expect(initialPrices.length).toBeGreaterThanOrEqual(2);

    // Wait for price updates (prices update every 2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 4000));

    // Check if any price has changed
    let changeDetected = false;
    for (let i = 0; i < initialPrices.length; i++) {
      const currentPrice = getCellValue(i, "price");
      if (currentPrice && currentPrice !== initialPrices[i]) {
        changeDetected = true;
        break;
      }
    }

    expect(changeDetected).toBe(true);
  },
};

/**
 * Test 2: Flash Animation Detection
 * Tests that cells show flash animation when values change
 */
export const FlashAnimationDetection: Story = {
  render: () => <LiveUpdatesTestComponent />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Wait for component to mount
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let flashDetected = false;
    const maxChecks = 15;
    let checks = 0;

    // Check for flash animations on price cells
    while (checks < maxChecks && !flashDetected) {
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
  },
};

/**
 * Test 3: Stock Decrease
 * Tests that stock values decrease over time
 */
export const StockDecrease: Story = {
  render: () => <LiveUpdatesTestComponent />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Wait for component to mount
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const initialStock = getCellValue(0, "stock");
    expect(initialStock).toBeTruthy();

    // Wait for stock changes (stocks decrease every 3 seconds)
    await new Promise((resolve) => setTimeout(resolve, 6000));

    const finalStock = getCellValue(0, "stock");
    expect(finalStock).toBeTruthy();

    // Parse stock values (remove commas if present)
    const initialStockNum = parseInt(initialStock!.replace(/,/g, ""));
    const finalStockNum = parseInt(finalStock!.replace(/,/g, ""));

    // Stock should have decreased or stayed the same (if it was already 0)
    expect(finalStockNum).toBeLessThanOrEqual(initialStockNum);
  },
};

/**
 * Test 4: Sales Increase
 * Tests that sales values increase over time
 */
export const SalesIncrease: Story = {
  render: () => <LiveUpdatesTestComponent />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Wait for component to mount
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const initialSales = getCellValue(0, "sales");
    expect(initialSales).toBeTruthy();

    // Wait for sales changes (sales increase every 3 seconds)
    await new Promise((resolve) => setTimeout(resolve, 6000));

    const finalSales = getCellValue(0, "sales");
    expect(finalSales).toBeTruthy();

    // Parse sales values (remove commas if present)
    const initialSalesNum = parseInt(initialSales!.replace(/,/g, ""));
    const finalSalesNum = parseInt(finalSales!.replace(/,/g, ""));

    // Sales should have increased
    expect(finalSalesNum).toBeGreaterThan(initialSalesNum);
  },
};

/**
 * Test 5: Multiple Updates Over Time
 * Tests that multiple updates occur across different time intervals
 */
export const MultipleUpdatesOverTime: Story = {
  render: () => <LiveUpdatesTestComponent />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Wait for component to mount
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const priceSnapshots: string[][] = [];
    const snapshotInterval = 2500;
    const totalSnapshots = 3;

    // Take initial snapshot
    const initialPrices: string[] = [];
    for (let i = 0; i < 3; i++) {
      const price = getCellValue(i, "price");
      if (price) {
        initialPrices.push(price);
      }
    }
    priceSnapshots.push(initialPrices);

    // Take additional snapshots
    for (let i = 1; i < totalSnapshots; i++) {
      await new Promise((resolve) => setTimeout(resolve, snapshotInterval));
      const currentPrices: string[] = [];
      for (let row = 0; row < 3; row++) {
        const price = getCellValue(row, "price");
        if (price) {
          currentPrices.push(price);
        }
      }
      priceSnapshots.push(currentPrices);
    }

    // Verify that prices changed between snapshots
    let changesDetected = 0;
    for (let snapshot = 1; snapshot < priceSnapshots.length; snapshot++) {
      const previousPrices = priceSnapshots[snapshot - 1];
      const currentPrices = priceSnapshots[snapshot];

      for (let row = 0; row < Math.min(previousPrices.length, currentPrices.length); row++) {
        if (previousPrices[row] !== currentPrices[row]) {
          changesDetected++;
          break;
        }
      }
    }

    // Expect changes in at least 1 out of 2 snapshot intervals
    expect(changesDetected).toBeGreaterThanOrEqual(1);
  },
};
