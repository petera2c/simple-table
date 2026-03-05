import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useEffect } from "react";
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

  const contentSpan = cell.querySelector(".st-cell-content");
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

// Expose tableRef for testing
let testTableRef: TableRefType | null = null;

const LiveUpdatesTestComponent = () => {
  const tableRef = useRef<TableRefType>(null);

  // Expose ref for tests
  useEffect(() => {
    const interval = setInterval(() => {
      if (tableRef.current) {
        testTableRef = tableRef.current;
      }
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

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

  const initialData = [
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
  ];

  return (
    <div style={{ padding: "20px" }}>
      <SimpleTable
        tableRef={tableRef}
        defaultHeaders={headers}
        rows={initialData}
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
 * Test 1: Update Data API - Price Update
 * Tests that updateData API updates cell values and triggers flash
 */
export const UpdateDataAPIPrice: Story = {
  render: () => <LiveUpdatesTestComponent />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Wait for component to mount and ref to be available
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify tableRef is available
    expect(testTableRef).toBeTruthy();

    // Get initial price value at row 0
    const initialPrice = getCellValue(0, "price");
    expect(initialPrice).toBeTruthy();

    // Update the price using the API at row 0
    testTableRef?.updateData({
      accessor: "price",
      rowIndex: 0,
      newValue: 99.99,
    });

    // Wait for update to apply
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verify the price changed
    const updatedPrice = getCellValue(0, "price");
    expect(updatedPrice).toBe("$99.99");
    expect(updatedPrice).not.toBe(initialPrice);
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

    // Wait for component to mount and ref to be available
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(testTableRef).toBeTruthy();

    // Verify no flash initially
    expect(hasCellUpdatingClass(1, "price")).toBe(false);

    // Trigger an update
    testTableRef!.updateData({
      accessor: "price",
      rowIndex: 1,
      newValue: 88.88,
    });

    // Check immediately for flash class (it should appear right away)
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(hasCellUpdatingClass(1, "price")).toBe(true);

    // Wait for flash animation to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Flash should be gone
    expect(hasCellUpdatingClass(1, "price")).toBe(false);
  },
};

/**
 * Test 3: Update Data API - Stock Update
 * Tests that updateData API can update stock values
 */
export const UpdateDataAPIStock: Story = {
  render: () => <LiveUpdatesTestComponent />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Wait for component to mount and ref to be available
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(testTableRef).toBeTruthy();

    // Get initial stock value
    const initialStock = getCellValue(0, "stock");
    expect(initialStock).toBeTruthy();

    // Update stock using the API
    testTableRef!.updateData({
      accessor: "stock",
      rowIndex: 0,
      newValue: 100,
    });

    // Wait for update to apply
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verify the stock changed
    const updatedStock = getCellValue(0, "stock");
    expect(updatedStock).toBe("100");
    expect(updatedStock).not.toBe(initialStock);
  },
};

/**
 * Test 4: Update Data API - Sales Update
 * Tests that updateData API can update sales values
 */
export const UpdateDataAPISales: Story = {
  render: () => <LiveUpdatesTestComponent />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Wait for component to mount and ref to be available
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(testTableRef).toBeTruthy();

    // Get initial sales value
    const initialSales = getCellValue(0, "sales");
    expect(initialSales).toBeTruthy();

    // Update sales using the API
    testTableRef!.updateData({
      accessor: "sales",
      rowIndex: 0,
      newValue: 500,
    });

    // Wait for update to apply
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verify the sales changed
    const updatedSales = getCellValue(0, "sales");
    expect(updatedSales).toBe("500");
    expect(updatedSales).not.toBe(initialSales);
  },
};

/**
 * Test 5: Multiple Cell Updates
 * Tests that multiple cells can be updated via the API
 */
export const MultipleCellUpdates: Story = {
  render: () => <LiveUpdatesTestComponent />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Wait for component to mount and ref to be available
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(testTableRef).toBeTruthy();

    // Get initial values for multiple cells
    const initialPrice0 = getCellValue(0, "price");
    const initialPrice1 = getCellValue(1, "price");
    const initialStock2 = getCellValue(2, "stock");

    expect(initialPrice0).toBeTruthy();
    expect(initialPrice1).toBeTruthy();
    expect(initialStock2).toBeTruthy();

    // Update multiple cells
    testTableRef!.updateData({
      accessor: "price",
      rowIndex: 0,
      newValue: 11.11,
    });

    testTableRef!.updateData({
      accessor: "price",
      rowIndex: 1,
      newValue: 22.22,
    });

    testTableRef!.updateData({
      accessor: "stock",
      rowIndex: 2,
      newValue: 999,
    });

    // Wait for updates to apply
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verify all cells changed
    expect(getCellValue(0, "price")).toBe("$11.11");
    expect(getCellValue(1, "price")).toBe("$22.22");
    expect(getCellValue(2, "stock")).toBe("999");
  },
};
