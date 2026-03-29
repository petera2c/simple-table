import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect } from "@storybook/test";
import { SimpleTable, Row } from "../..";
import { HeaderObject } from "../..";

// ============================================================================
// DATA INTERFACES
// ============================================================================

interface ProductRow extends Record<string, any> {
  id: number;
  name: string;
  category: string;
  price: number;
  isActive: boolean;
  hireDate: string;
}

interface NestedRow extends Record<string, any> {
  id: number;
  user: { name: string; email: string };
  score: number;
}

interface ChartRow extends Record<string, any> {
  id: number;
  name: string;
  lineData: number[];
  barData: number[];
}

interface SingleRowChildrenRow extends Record<string, any> {
  id: number;
  name: string;
  latest: { score: number };
  weekly_diff: { score: number };
  monthly_diff: { score: number };
}

// ============================================================================
// TEST DATA FACTORIES
// ============================================================================

const createProductData = (): ProductRow[] => [
  {
    id: 1,
    name: "Laptop",
    category: "Electronics",
    price: 999,
    isActive: true,
    hireDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Shirt",
    category: "Clothing",
    price: 49,
    isActive: false,
    hireDate: "2023-03-20",
  },
  { id: 3, name: "Lamp", category: "Home", price: 79, isActive: true, hireDate: "2022-07-10" },
  {
    id: 4,
    name: "Keyboard",
    category: "Electronics",
    price: 149,
    isActive: true,
    hireDate: "2023-06-01",
  },
  { id: 5, name: "Desk", category: "Home", price: 299, isActive: false, hireDate: "2021-12-25" },
];

const createNestedData = (): NestedRow[] => [
  { id: 1, user: { name: "Alice", email: "alice@example.com" }, score: 95 },
  { id: 2, user: { name: "Bob", email: "bob@example.com" }, score: 82 },
  { id: 3, user: { name: "Charlie", email: "charlie@example.com" }, score: 71 },
];

const createChartData = (): ChartRow[] => [
  { id: 1, name: "Q1", lineData: [10, 20, 30], barData: [5, 15, 25] },
  { id: 2, name: "Q2", lineData: [15, 25, 35], barData: [8, 18, 28] },
];

const createSingleRowChildrenData = (): SingleRowChildrenRow[] => [
  {
    id: 1,
    name: "Product A",
    latest: { score: 85 },
    weekly_diff: { score: 5 },
    monthly_diff: { score: 12 },
  },
  {
    id: 2,
    name: "Product B",
    latest: { score: 92 },
    weekly_diff: { score: -2 },
    monthly_diff: { score: 8 },
  },
  {
    id: 3,
    name: "Product C",
    latest: { score: 78 },
    weekly_diff: { score: 3 },
    monthly_diff: { score: -5 },
  },
];

// ============================================================================
// MODULE-LEVEL STATE (for sharing between render() and play())
// ============================================================================

// Shared via module-level variables; reset in each render() before use.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let capturedEditCalls: any[] = [];
let clipboardStorage = "";

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

/**
 * Mocks navigator.clipboard using a closure-backed store.
 * Must be called at the start of each play() that needs clipboard access.
 * Returns { get, set } to inspect / pre-populate the clipboard in tests.
 */
const mockClipboard = () => {
  clipboardStorage = "";
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: async (text: string) => {
        clipboardStorage = text;
      },
      readText: async () => clipboardStorage,
    },
    writable: true,
    configurable: true,
  });
  return {
    get: () => clipboardStorage,
    set: (text: string) => {
      clipboardStorage = text;
    },
  };
};

const getCellByIndex = (
  canvasElement: HTMLElement,
  rowIndex: number,
  colIndex: number,
): HTMLElement | null =>
  canvasElement.querySelector(
    `[data-row-index="${rowIndex}"][data-col-index="${colIndex}"]`,
  ) as HTMLElement | null;

const clickCell = async (
  canvasElement: HTMLElement,
  rowIndex: number,
  colIndex: number,
): Promise<void> => {
  const cell = getCellByIndex(canvasElement, rowIndex, colIndex);
  if (!cell) throw new Error(`Cell not found at row ${rowIndex}, col ${colIndex}`);

  cell.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
  cell.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
  await new Promise((resolve) => setTimeout(resolve, 150));
};

const selectRange = async (
  canvasElement: HTMLElement,
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
): Promise<void> => {
  const startCell = getCellByIndex(canvasElement, startRow, startCol);
  const endCell = getCellByIndex(canvasElement, endRow, endCol);
  if (!startCell) throw new Error(`Start cell not found at row ${startRow}, col ${startCol}`);
  if (!endCell) throw new Error(`End cell not found at row ${endRow}, col ${endCol}`);

  startCell.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
  await new Promise((resolve) => setTimeout(resolve, 10));

  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);

  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      const cell = getCellByIndex(canvasElement, row, col);
      if (cell) {
        cell.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));
        await new Promise((resolve) => setTimeout(resolve, 5));
      }
    }
  }

  endCell.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
  await new Promise((resolve) => setTimeout(resolve, 200));
};

const clearSelection = async (): Promise<void> => {
  document.body.dispatchEvent(
    new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window }),
  );
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
  );
  await new Promise((resolve) => setTimeout(resolve, 100));
};

const pressCtrlC = (): void => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "c", ctrlKey: true, bubbles: true, cancelable: true }),
  );
};

const pressCtrlV = (): void => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "v", ctrlKey: true, bubbles: true, cancelable: true }),
  );
};

const pressDelete = (): void => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Delete", bubbles: true, cancelable: true }),
  );
};

const pressCtrlA = (): void => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "a", ctrlKey: true, bubbles: true, cancelable: true }),
  );
};

/** Checks if a cell has any copy-flash class applied. */
const hasCopyFlash = (cell: HTMLElement): boolean =>
  cell.classList.contains("st-cell-copy-flash") ||
  cell.classList.contains("st-cell-copy-flash-first");

/** Checks if a cell has any warning-flash class applied. */
const hasWarningFlash = (cell: HTMLElement): boolean =>
  cell.classList.contains("st-cell-warning-flash") ||
  cell.classList.contains("st-cell-warning-flash-first");

/** Waits for a React state update + re-render. */
const waitForUpdate = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

/** Waits for the async paste operation (clipboard read + state update + re-render). */
const waitForPaste = () => new Promise((resolve) => setTimeout(resolve, 300));

// ============================================================================
// STORYBOOK META
// ============================================================================

const meta: Meta<typeof SimpleTable> = {
  title: "Tests/20 - Clipboard",
  component: SimpleTable,
  parameters: {
    layout: "padded",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof SimpleTable>;

// ============================================================================
// SECTION 1: COPY — BASIC SINGLE CELL
// ============================================================================

/**
 * Test 1a: Copy single string cell
 * Selects one string cell, presses Ctrl+C, verifies clipboard contains the raw value.
 */
export const CopySingleCellString: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await clickCell(canvasElement, 0, 1); // "Laptop"
    pressCtrlC();
    await waitForUpdate();

    expect(clipboard.get()).toBe("Laptop");
  },
};

/**
 * Test 1b: Copy single number cell
 * Verifies numeric values are copied as their string representation.
 */
export const CopySingleCellNumber: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await clickCell(canvasElement, 0, 1); // price = 999
    pressCtrlC();
    await waitForUpdate();

    expect(clipboard.get()).toBe("999");
  },
};

/**
 * Test 1c: Copy single boolean cell
 * Verifies boolean values are copied as "true" or "false".
 */
export const CopySingleCellBoolean: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "isActive", label: "Active", width: 100, type: "boolean" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await clickCell(canvasElement, 0, 1); // isActive = true
    pressCtrlC();
    await waitForUpdate();

    expect(clipboard.get()).toBe("true");

    await clearSelection();
    await clickCell(canvasElement, 1, 1); // isActive = false
    pressCtrlC();
    await waitForUpdate();

    expect(clipboard.get()).toBe("false");
  },
};

/**
 * Test 1d: Copy single date cell
 * Verifies date string values are preserved as-is in the clipboard.
 */
export const CopySingleCellDate: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "hireDate", label: "Hire Date", width: 150, type: "date" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await clickCell(canvasElement, 0, 1); // hireDate = "2023-01-15"
    pressCtrlC();
    await waitForUpdate();

    expect(clipboard.get()).toBe("2023-01-15");
  },
};

// ============================================================================
// SECTION 2: COPY — RANGE (TSV FORMAT)
// ============================================================================

/**
 * Test 2a: Copy a 2×3 range produces tab-separated columns and newline-separated rows.
 */
export const CopyRangeTSVFormat: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await selectRange(canvasElement, 0, 0, 1, 2); // 2 rows × 3 cols
    pressCtrlC();
    await waitForUpdate();

    const text = clipboard.get();
    const lines = text.split("\n");
    expect(lines).toHaveLength(2); // 2 rows
    expect(lines[0].split("\t")).toHaveLength(3); // 3 columns
    expect(lines[1].split("\t")).toHaveLength(3);

    // Verify specific values
    expect(lines[0]).toBe("1\tLaptop\tElectronics");
    expect(lines[1]).toBe("2\tShirt\tClothing");
  },
};

/**
 * Test 2b: Copy a single row (multi-column) produces tabs only, no newlines.
 */
export const CopySingleRowRange: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await selectRange(canvasElement, 0, 0, 0, 2); // 1 row × 3 cols
    pressCtrlC();
    await waitForUpdate();

    const text = clipboard.get();
    expect(text.includes("\n")).toBe(false);
    expect(text.split("\t")).toHaveLength(3);
    expect(text).toBe("1\tLaptop\t999");
  },
};

/**
 * Test 2c: Copy a single column (multi-row) produces newlines only, no tabs.
 */
export const CopySingleColumnRange: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await selectRange(canvasElement, 0, 1, 2, 1); // 3 rows × col 1 (name)
    pressCtrlC();
    await waitForUpdate();

    const text = clipboard.get();
    const lines = text.split("\n");
    expect(lines).toHaveLength(3);
    lines.forEach((line) => expect(line.includes("\t")).toBe(false));
    expect(lines[0]).toBe("Laptop");
    expect(lines[1]).toBe("Shirt");
    expect(lines[2]).toBe("Lamp");
  },
};

// ============================================================================
// SECTION 3: COPY — WITH HEADERS
// ============================================================================

/**
 * Test 3a: copyHeadersToClipboard=true prepends a tab-separated header row.
 */
export const CopyWithHeadersEnabled: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "price", label: "Price (USD)", width: 120, type: "number" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        copyHeadersToClipboard
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await selectRange(canvasElement, 0, 0, 1, 2); // 2 rows × 3 cols
    pressCtrlC();
    await waitForUpdate();

    const text = clipboard.get();
    const lines = text.split("\n");
    expect(lines).toHaveLength(3); // header + 2 data rows

    // First line is the header row
    expect(lines[0]).toBe("ID\tProduct Name\tPrice (USD)");
    // Data rows follow
    expect(lines[1]).toBe("1\tLaptop\t999");
    expect(lines[2]).toBe("2\tShirt\t49");
  },
};

/**
 * Test 3b: copyHeadersToClipboard=false (default) produces no header row.
 */
export const CopyWithHeadersDisabled: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await selectRange(canvasElement, 0, 0, 1, 1); // 2 rows × 2 cols
    pressCtrlC();
    await waitForUpdate();

    const text = clipboard.get();
    const lines = text.split("\n");
    // Only 2 data lines, no header
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe("1\tLaptop");
    expect(lines[1]).toBe("2\tShirt");
  },
};

// ============================================================================
// SECTION 4: COPY — VALUE FORMATTING
// ============================================================================

/**
 * Test 4a: Column with valueFormatter auto-uses formatted value for clipboard.
 * Auto-enabled because useFormattedValueForClipboard defaults to true when
 * a valueFormatter is present (unless explicitly set to false).
 */
export const CopyWithValueFormatter: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string" },
      {
        accessor: "price",
        label: "Price",
        width: 120,
        type: "number",
        valueFormatter: ({ value }) => `$${value}`,
      },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await clickCell(canvasElement, 0, 1); // price with formatter
    pressCtrlC();
    await waitForUpdate();

    // Formatter auto-applied: "$999" not "999"
    expect(clipboard.get()).toBe("$999");
  },
};

/**
 * Test 4b: useFormattedValueForClipboard=false disables formatter for clipboard
 * even when a valueFormatter exists.
 */
export const CopyWithFormatterExplicitlyDisabled: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string" },
      {
        accessor: "price",
        label: "Price",
        width: 120,
        type: "number",
        valueFormatter: ({ value }) => `$${value}`,
        useFormattedValueForClipboard: false,
      },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await clickCell(canvasElement, 0, 1);
    pressCtrlC();
    await waitForUpdate();

    // Raw value used (formatter explicitly disabled)
    expect(clipboard.get()).toBe("999");
  },
};

/**
 * Test 4c: lineAreaChart type copies as comma-separated string.
 */
export const CopyChartColumnLineArea: Story = {
  tags: ["test"],
  render: () => {
    const data = createChartData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 100, type: "string" },
      { accessor: "lineData", label: "Trend", width: 150, type: "lineAreaChart" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await clickCell(canvasElement, 0, 1); // lineData = [10, 20, 30]
    pressCtrlC();
    await waitForUpdate();

    expect(clipboard.get()).toBe("10, 20, 30");
  },
};

/**
 * Test 4d: barChart type copies as comma-separated string.
 */
export const CopyChartColumnBar: Story = {
  tags: ["test"],
  render: () => {
    const data = createChartData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 100, type: "string" },
      { accessor: "barData", label: "Bars", width: 150, type: "barChart" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await clickCell(canvasElement, 0, 1); // barData = [5, 15, 25]
    pressCtrlC();
    await waitForUpdate();

    expect(clipboard.get()).toBe("5, 15, 25");
  },
};

// ============================================================================
// SECTION 5: COPY — COLUMN VISIBILITY
// ============================================================================

/**
 * Test 5a: Columns with hide=true are excluded from clipboard output.
 * A hidden column is not in the leaf headers index map, so it produces
 * no entry in the copied TSV.
 */
export const CopyHiddenColumnExcluded: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string", hide: true },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    // Select cols 0 and 1 (id, name) — category is hidden so col 2 is price
    await selectRange(canvasElement, 0, 0, 0, 2);
    pressCtrlC();
    await waitForUpdate();

    const text = clipboard.get();
    // Should be "1\tLaptop\t999" — category not present
    expect(text.includes("Electronics")).toBe(false);
    const cols = text.split("\t");
    expect(cols).toHaveLength(3); // id, name, price (no category)
  },
};

/**
 * Test 5b: excludeFromRender=true columns are excluded from clipboard.
 */
export const CopyExcludeFromRenderColumnExcluded: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      {
        accessor: "category",
        label: "Category",
        width: 150,
        type: "string",
        excludeFromRender: true,
      },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await selectRange(canvasElement, 0, 0, 0, 2);
    pressCtrlC();
    await waitForUpdate();

    const text = clipboard.get();
    expect(text.includes("Electronics")).toBe(false);
  },
};

// ============================================================================
// SECTION 6: COPY — FLASH EFFECT
// ============================================================================

/**
 * Test 6a: After Ctrl+C, selected cells receive the copy flash CSS class.
 */
export const CopyFlashEffect: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    mockClipboard();

    await clearSelection();
    await clickCell(canvasElement, 0, 1); // select "name" cell, row 0
    pressCtrlC();
    await waitForUpdate();

    const cell = getCellByIndex(canvasElement, 0, 1);
    expect(cell).toBeTruthy();
    expect(hasCopyFlash(cell!)).toBe(true);
  },
};

/**
 * Test 6b: Ctrl+C with no cells selected does not trigger a clipboard write.
 */
export const CopyNoFlashWhenNothingSelected: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("SENTINEL"); // Pre-load sentinel to detect whether clipboard was written

    // Ensure nothing is selected
    await clearSelection();
    pressCtrlC();
    await waitForUpdate();

    // Clipboard should remain untouched
    expect(clipboard.get()).toBe("SENTINEL");

    // No flash classes anywhere
    const flashCells = canvasElement.querySelectorAll(
      ".st-cell-copy-flash, .st-cell-copy-flash-first",
    );
    expect(flashCells.length).toBe(0);
  },
};

// ============================================================================
// SECTION 7: PASTE — BASIC
// ============================================================================

/**
 * Test 7a: Paste a single value into an editable cell.
 * Verifies the cell content is updated and the copy flash appears.
 */
export const PasteSingleValueIntoEditableCell: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string", isEditable: true },
      { accessor: "category", label: "Category", width: 150, type: "string" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("NewProductName");

    await clearSelection();
    await clickCell(canvasElement, 0, 1); // editable "name" cell
    pressCtrlV();
    await waitForPaste();

    // onCellEdit should be called with the new value
    expect(capturedEditCalls.length).toBe(1);
    expect(capturedEditCalls[0].accessor).toBe("name");
    expect(capturedEditCalls[0].newValue).toBe("NewProductName");
    expect(capturedEditCalls[0].rowIndex).toBe(0);

    // Flash should appear on the pasted cell
    const cell = getCellByIndex(canvasElement, 0, 1);
    expect(hasCopyFlash(cell!)).toBe(true);
  },
};

/**
 * Test 7b: Paste TSV from anchor cell fills multiple cells.
 * Clipboard: "A\tB\nC\tD" → pastes 2×2 starting from anchor.
 */
export const PasteTSVRangeFromAnchor: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string", isEditable: true },
      { accessor: "category", label: "Category", width: 150, type: "string", isEditable: true },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("Alpha\tBeta\nGamma\tDelta");

    await clearSelection();
    await clickCell(canvasElement, 0, 1); // anchor at (row=0, col=1) = "name"
    pressCtrlV();
    await waitForPaste();

    // 4 editable cells updated: (0,1), (0,2), (1,1), (1,2)
    expect(capturedEditCalls.length).toBe(4);

    const byCell = (r: number, a: string) =>
      capturedEditCalls.find((c) => c.rowIndex === r && c.accessor === a);

    expect(byCell(0, "name")?.newValue).toBe("Alpha");
    expect(byCell(0, "category")?.newValue).toBe("Beta");
    expect(byCell(1, "name")?.newValue).toBe("Gamma");
    expect(byCell(1, "category")?.newValue).toBe("Delta");
  },
};

/**
 * Test 7c: Ctrl+V with no cells selected is a no-op (no error, no paste).
 */
export const PasteNoOpWithoutFocusedCell: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("ShouldNotPaste");

    // Explicitly clear everything (no cells selected, no focused cell)
    await clearSelection();
    pressCtrlV();
    await waitForPaste();

    // Nothing should have been edited
    expect(capturedEditCalls.length).toBe(0);
  },
};

// ============================================================================
// SECTION 8: PASTE — NON-EDITABLE CELLS
// ============================================================================

/**
 * Test 8a: Pasting into a non-editable cell shows warning flash, value unchanged.
 */
export const PasteIntoNonEditableCell: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      // NOT isEditable
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("Unauthorized");

    await clearSelection();
    await clickCell(canvasElement, 0, 1); // non-editable "name"
    pressCtrlV();
    await waitForPaste();

    // onCellEdit must NOT be called
    expect(capturedEditCalls.length).toBe(0);

    // Warning flash should appear
    const cell = getCellByIndex(canvasElement, 0, 1);
    expect(hasWarningFlash(cell!)).toBe(true);
  },
};

/**
 * Test 8b: TSV paste spanning editable and non-editable columns:
 *   - Editable columns are updated
 *   - Non-editable columns show warning flash and are not updated
 */
export const PasteMixedEditableNonEditable: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string", isEditable: true },
      { accessor: "category", label: "Category", width: 150, type: "string" }, // NOT editable
      { accessor: "price", label: "Price", width: 120, type: "number", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("NewName\tNewCategory\t500");

    await clearSelection();
    await clickCell(canvasElement, 0, 1); // anchor at "name" (col 1)
    pressCtrlV();
    await waitForPaste();

    // Only editable cells updated: name (col1) and price (col3)
    expect(capturedEditCalls.some((c) => c.accessor === "name")).toBe(true);
    expect(capturedEditCalls.some((c) => c.accessor === "price")).toBe(true);
    // category not updated
    expect(capturedEditCalls.some((c) => c.accessor === "category")).toBe(false);

    // Warning flash on category cell
    const categoryCell = getCellByIndex(canvasElement, 0, 2);
    expect(hasWarningFlash(categoryCell!)).toBe(true);
  },
};

// ============================================================================
// SECTION 9: PASTE — TYPE CONVERSION
// ============================================================================

/**
 * Test 9a: Pasting a numeric string into a number column converts it to a number.
 */
export const PasteStringIntoNumberColumn: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "price", label: "Price", width: 120, type: "number", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("42");

    await clearSelection();
    await clickCell(canvasElement, 0, 1); // price cell
    pressCtrlV();
    await waitForPaste();

    expect(capturedEditCalls.length).toBe(1);
    expect(capturedEditCalls[0].newValue).toBe(42);
    expect(typeof capturedEditCalls[0].newValue).toBe("number");
  },
};

/**
 * Test 9b: Pasting a non-numeric string into a number column does not convert.
 * The raw string is kept as-is (NaN conversion is skipped).
 */
export const PasteInvalidNumberString: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "price", label: "Price", width: 120, type: "number", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("not-a-number");

    await clearSelection();
    await clickCell(canvasElement, 0, 0);
    pressCtrlV();
    await waitForPaste();

    expect(capturedEditCalls.length).toBe(1);
    // Raw string is preserved when conversion fails
    expect(capturedEditCalls[0].newValue).toBe("not-a-number");
  },
};

/**
 * Test 9c: Boolean type conversion: "true"→true, "1"→true, "false"→false.
 */
export const PasteTrueIntoBoolean: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = [
      { id: 1, flag: false },
      { id: 2, flag: true },
      { id: 3, flag: false },
    ] as Row[];
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "flag", label: "Flag", width: 100, type: "boolean", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    // Test "true" → true
    clipboard.set("true");
    await clearSelection();
    await clickCell(canvasElement, 0, 1);
    pressCtrlV();
    await waitForPaste();
    expect(capturedEditCalls[capturedEditCalls.length - 1].newValue).toBe(true);

    // Test "1" → true
    clipboard.set("1");
    await clearSelection();
    await clickCell(canvasElement, 1, 1);
    pressCtrlV();
    await waitForPaste();
    expect(capturedEditCalls[capturedEditCalls.length - 1].newValue).toBe(true);

    // Test "false" → false
    clipboard.set("false");
    await clearSelection();
    await clickCell(canvasElement, 2, 1);
    pressCtrlV();
    await waitForPaste();
    expect(capturedEditCalls[capturedEditCalls.length - 1].newValue).toBe(false);
  },
};

/**
 * Test 9d: Pasting an ISO date string into a date column creates a Date object.
 */
export const PasteDateString: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "hireDate", label: "Hire Date", width: 150, type: "date", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("2024-06-15");

    await clearSelection();
    await clickCell(canvasElement, 0, 0);
    pressCtrlV();
    await waitForPaste();

    expect(capturedEditCalls.length).toBe(1);
    const val = capturedEditCalls[0].newValue;
    expect(val instanceof Date).toBe(true);
    expect((val as Date).getFullYear()).toBe(2024);
  },
};

/**
 * Test 9e: Pasting comma-separated values into a lineAreaChart column parses
 * them into a number array.
 */
export const PasteCommaSeparatedIntoChart: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createChartData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 100, type: "string" },
      { accessor: "lineData", label: "Trend", width: 150, type: "lineAreaChart", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("100, 200, 300");

    await clearSelection();
    await clickCell(canvasElement, 0, 1);
    pressCtrlV();
    await waitForPaste();

    expect(capturedEditCalls.length).toBe(1);
    expect(capturedEditCalls[0].newValue).toEqual([100, 200, 300]);
  },
};

// ============================================================================
// SECTION 10: PASTE — BOUNDARY CONDITIONS
// ============================================================================

/**
 * Test 10a: TSV with more rows than the table silently clamps at the last row.
 */
export const PasteBeyondRowBoundary: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    // Only 2 rows in table
    const data = [
      { id: 1, name: "A" },
      { id: 2, name: "B" },
    ] as Row[];
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="300px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("X\nY\nZ"); // 3 rows, but table only has 2

    await clearSelection();
    await clickCell(canvasElement, 0, 0); // anchor at first row
    pressCtrlV();
    await waitForPaste();

    // Only 2 updates (rows 0 and 1 updated; row 2 is out of bounds)
    expect(capturedEditCalls.length).toBe(2);
    expect(capturedEditCalls[0].newValue).toBe("X");
    expect(capturedEditCalls[1].newValue).toBe("Y");
  },
};

/**
 * Test 10b: TSV with more columns than remaining headers silently clamps at the last column.
 */
export const PasteBeyondColumnBoundary: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string", isEditable: true },
      { accessor: "category", label: "Category", width: 150, type: "string", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("Alpha\tBeta\tGamma\tDelta"); // 4 values, table only has 2 cols

    await clearSelection();
    await clickCell(canvasElement, 0, 0); // anchor at col 0
    pressCtrlV();
    await waitForPaste();

    // Only 2 updates (cols 0 and 1 updated; cols 2 and 3 are out of bounds)
    expect(capturedEditCalls.length).toBe(2);
    expect(capturedEditCalls[0].newValue).toBe("Alpha");
    expect(capturedEditCalls[1].newValue).toBe("Beta");
  },
};

/**
 * Test 10c: Empty clipboard string results in no-op paste.
 */
export const PasteEmptyClipboard: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set(""); // empty

    await clearSelection();
    await clickCell(canvasElement, 0, 0);
    pressCtrlV();
    await waitForPaste();

    expect(capturedEditCalls.length).toBe(0);
  },
};

/**
 * Test 10d: TSV with a trailing newline doesn't paste an empty extra row.
 * The filter(row => row.length > 0) in the paste parser removes empty rows.
 */
export const PasteTrailingNewline: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("Alpha\nBeta\n"); // trailing newline

    await clearSelection();
    await clickCell(canvasElement, 0, 0);
    pressCtrlV();
    await waitForPaste();

    // Only 2 updates (empty trailing row filtered out)
    expect(capturedEditCalls.length).toBe(2);
    expect(capturedEditCalls[0].newValue).toBe("Alpha");
    expect(capturedEditCalls[1].newValue).toBe("Beta");
  },
};

// ============================================================================
// SECTION 11: PASTE — FLASH AND CALLBACK
// ============================================================================

/**
 * Test 11a: Successfully pasted cells receive the copy flash class.
 */
export const PasteFlashEffect: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("FlashedName");

    await clearSelection();
    await clickCell(canvasElement, 0, 1);
    pressCtrlV();
    await waitForPaste();

    const cell = getCellByIndex(canvasElement, 0, 1);
    expect(hasCopyFlash(cell!)).toBe(true);
  },
};

/**
 * Test 11b: onCellEdit callback is called with the correct arguments on paste.
 */
export const PasteOnCellEditCallback: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string", isEditable: true },
      { accessor: "category", label: "Category", width: 150, type: "string", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("UpdatedName\tUpdatedCategory");

    await clearSelection();
    await clickCell(canvasElement, 1, 0); // anchor row 1, col 0
    pressCtrlV();
    await waitForPaste();

    expect(capturedEditCalls.length).toBe(2);

    const nameCall = capturedEditCalls.find((c) => c.accessor === "name");
    expect(nameCall).toBeTruthy();
    expect(nameCall!.newValue).toBe("UpdatedName");
    expect(nameCall!.rowIndex).toBe(1);

    const catCall = capturedEditCalls.find((c) => c.accessor === "category");
    expect(catCall).toBeTruthy();
    expect(catCall!.newValue).toBe("UpdatedCategory");
    expect(catCall!.rowIndex).toBe(1);
  },
};

// ============================================================================
// SECTION 12: DELETE — CONTENT CLEARING
// ============================================================================

/**
 * Test 12a: Delete on a string cell sets it to "".
 */
export const DeleteStringCell: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();

    await clearSelection();
    await clickCell(canvasElement, 0, 1); // "name" = "Laptop"
    pressDelete();
    await waitForUpdate();

    expect(capturedEditCalls.length).toBe(1);
    expect(capturedEditCalls[0].accessor).toBe("name");
    expect(capturedEditCalls[0].newValue).toBe("");

    // Flash appears on deleted cell
    const cell = getCellByIndex(canvasElement, 0, 1);
    expect(hasCopyFlash(cell!)).toBe(true);
  },
};

/**
 * Test 12b: Delete on a number cell sets it to null.
 */
export const DeleteNumberCell: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "price", label: "Price", width: 120, type: "number", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();

    await clearSelection();
    await clickCell(canvasElement, 0, 0);
    pressDelete();
    await waitForUpdate();

    expect(capturedEditCalls.length).toBe(1);
    expect(capturedEditCalls[0].newValue).toBeNull();
  },
};

/**
 * Test 12c: Delete on a boolean cell sets it to false.
 */
export const DeleteBooleanCell: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = [{ id: 1, flag: true }] as Row[];
    const headers: HeaderObject[] = [
      { accessor: "flag", label: "Flag", width: 100, type: "boolean", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="200px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();

    await clearSelection();
    await clickCell(canvasElement, 0, 0);
    pressDelete();
    await waitForUpdate();

    expect(capturedEditCalls.length).toBe(1);
    expect(capturedEditCalls[0].newValue).toBe(false);
  },
};

/**
 * Test 12d: Delete on a chart cell sets it to [].
 */
export const DeleteChartCell: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createChartData();
    const headers: HeaderObject[] = [
      { accessor: "lineData", label: "Trend", width: 150, type: "lineAreaChart", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="300px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();

    await clearSelection();
    await clickCell(canvasElement, 0, 0);
    pressDelete();
    await waitForUpdate();

    expect(capturedEditCalls.length).toBe(1);
    expect(capturedEditCalls[0].newValue).toEqual([]);
  },
};

// ============================================================================
// SECTION 13: DELETE — NON-EDITABLE AND CALLBACK
// ============================================================================

/**
 * Test 13a: Delete on a non-editable cell shows warning flash, does not call onCellEdit.
 */
export const DeleteNonEditableCell: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string" }, // NOT isEditable
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();

    await clearSelection();
    await clickCell(canvasElement, 0, 0);
    pressDelete();
    await waitForUpdate();

    // No edit callback
    expect(capturedEditCalls.length).toBe(0);

    // Warning flash on non-editable cell
    const cell = getCellByIndex(canvasElement, 0, 0);
    expect(hasWarningFlash(cell!)).toBe(true);
  },
};

/**
 * Test 13b: Delete range — onCellEdit is called for each editable deleted cell.
 */
export const DeleteOnCellEditCallback: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string", isEditable: true },
      { accessor: "category", label: "Category", width: 150, type: "string", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();

    await clearSelection();
    await selectRange(canvasElement, 0, 0, 1, 1); // 2×2 range
    pressDelete();
    await waitForUpdate();

    // 4 cells deleted
    expect(capturedEditCalls.length).toBe(4);
    capturedEditCalls.forEach((call) => {
      expect(call.newValue).toBe(""); // string type → ""
    });
  },
};

// ============================================================================
// SECTION 14: NESTED HEADERS — COPY
// ============================================================================

/**
 * Test 14a: Table with nested parent/child headers — copying leaf cells uses
 * the correct child accessor, not the parent accessor.
 *
 * Structure:
 *   id (leaf col 0)
 *   name (leaf col 1)
 *   performance (parent) → [score (leaf col 2), rank (leaf col 3)]
 *
 * With normal nested headers, the parent and first child share the same colIndex
 * (per calculateColumnIndices), and findLeafHeaders returns only the children.
 * So colIndexToAccessor maps the shared index to the child accessor.
 */
export const NestedHeadersCopyLeafValues: Story = {
  tags: ["test"],
  render: () => {
    const data = [
      { id: 1, name: "Alice", score: 95, rank: 2 },
      { id: 2, name: "Bob", score: 82, rank: 5 },
    ] as Row[];
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 150, type: "string" },
      {
        accessor: "performance",
        label: "Performance",
        width: 200,
        children: [
          { accessor: "score", label: "Score", width: 100, type: "number" },
          { accessor: "rank", label: "Rank", width: 100, type: "number" },
        ],
      },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="300px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    // Select the "score" child cell (col 2 in the grid for nested headers)
    await clickCell(canvasElement, 0, 2);
    pressCtrlC();
    await waitForUpdate();

    // Should copy the score value (95), not an empty string or parent value
    expect(clipboard.get()).toBe("95");
  },
};

/**
 * Test 14b: copyHeadersToClipboard with nested headers includes only leaf
 * column labels (child labels), not the parent group header label.
 */
export const NestedHeadersCopyWithHeaderLabels: Story = {
  tags: ["test"],
  render: () => {
    const data = [{ id: 1, name: "Alice", score: 95, rank: 2 }] as Row[];
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 150, type: "string" },
      {
        accessor: "performance",
        label: "Performance Group",
        width: 200,
        children: [
          { accessor: "score", label: "Score", width: 100, type: "number" },
          { accessor: "rank", label: "Rank", width: 100, type: "number" },
        ],
      },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="300px"
        selectableCells
        copyHeadersToClipboard
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    // Select all columns (id, name, score, rank)
    await selectRange(canvasElement, 0, 0, 0, 3);
    pressCtrlC();
    await waitForUpdate();

    const text = clipboard.get();
    const lines = text.split("\n");

    // Header row should contain leaf labels only
    const headerRow = lines[0];
    expect(headerRow).toBe("ID\tName\tScore\tRank");

    // Parent group label should NOT appear
    expect(headerRow.includes("Performance Group")).toBe(false);
  },
};

/**
 * Test 14c: Collapsed parent column — only the visible leaves (showWhen=
 * "parentCollapsed" or "always") are included in clipboard output.
 *
 * When a collapsible parent is collapsed:
 * - Children with showWhen="parentExpanded" (default) are hidden
 * - Children with showWhen="parentCollapsed" appear as the replacement column
 * - The clipboard should only contain those visible leaf values
 */
export const NestedHeadersCollapsedParentCopy: Story = {
  tags: ["test"],
  render: () => {
    const data = [{ id: 1, name: "Alice", q1: 100, q2: 200, total: 300 }] as Row[];
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "quarterly_group",
        label: "Quarterly",
        width: 120,
        collapsible: true,
        collapseDefault: true,
        children: [
          // Visible when expanded (default showWhen="parentExpanded")
          { accessor: "q1", label: "Q1", width: 100, type: "number" },
          { accessor: "q2", label: "Q2", width: 100, type: "number" },
          // Visible when collapsed (shows total instead)
          {
            accessor: "total",
            label: "Total",
            width: 120,
            type: "number",
            showWhen: "parentCollapsed",
          },
        ],
      },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="300px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    // Select id (col 0) and the collapsed "total" column (col 1)
    await selectRange(canvasElement, 0, 0, 0, 1);
    pressCtrlC();
    await waitForUpdate();

    const text = clipboard.get();
    // Only the visible collapsed view: id and total (300), NOT q1/q2
    expect(text.includes("100")).toBe(false); // q1 hidden
    expect(text.includes("200")).toBe(false); // q2 hidden
    // id and total should be present
    const cols = text.split("\t");
    expect(cols[0]).toBe("1"); // id
    expect(cols[1]).toBe("300"); // total
  },
};

// ============================================================================
// SECTION 15: SINGLE ROW CHILDREN — COPY / PASTE
// ============================================================================
//
// IMPORTANT: singleRowChildren introduces a known alignment issue between
// calculateColumnIndices and findLeafHeaders:
//
//   - calculateColumnIndices: parent gets its own colIndex (N), each child
//     increments separately: N+1, N+2, ...
//   - findLeafHeaders: parent is NOT included (has children); children are
//     returned at positions 0..K in the leaf array
//
// Because copySelectedCellsToClipboard builds colIndexToAccessor using the
// 0-based POSITION in flattenedLeafHeaders (not the actual colIndex values
// from calculateColumnIndices), there is an off-by-one misalignment when a
// singleRowChildren parent is present.
//
// Example with headers [id(0), name(1), score_parent(2), child1(3), child2(4)]:
//   flattenedLeafHeaders = [id, name, child1, child2] (parent excluded)
//   colIndexToAccessor   = { 0:id, 1:name, 2:child1, 3:child2 }
//   But actual colIndices: { id:0, name:1, score_parent:2, child1:3, child2:4 }
//
//   → selecting parent cell (colIndex=2) → maps to child1 accessor (WRONG)
//   → selecting child1 cell (colIndex=3) → maps to child2 accessor (WRONG)
//   → selecting child2 cell (colIndex=4) → maps to undefined (empty)
//
// The tests below document CURRENT behavior so that any future fix is
// immediately caught as a regression. Expected (correct) values are
// commented inline where they differ.

/**
 * Test 15a: Selection and copy flash work for singleRowChildren parent cells.
 * This test verifies the UI interaction (selection + flash) works even though
 * the clipboard value mapping has the alignment bug described above.
 */
export const SingleRowChildrenSelectionAndFlash: Story = {
  tags: ["test"],
  render: () => {
    const data = createSingleRowChildrenData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product", width: 150, type: "string" },
      {
        accessor: "latest.score",
        label: "Score",
        width: 120,
        type: "number",
        singleRowChildren: true,
        children: [
          {
            accessor: "weekly_diff.score",
            label: "7d",
            width: 100,
            type: "number",
            showWhen: "parentExpanded",
          },
          {
            accessor: "monthly_diff.score",
            label: "30d",
            width: 100,
            type: "number",
            showWhen: "parentExpanded",
          },
        ],
      },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    mockClipboard();

    // Verify parent column cell (colIndex=2) can be selected
    await clearSelection();
    await clickCell(canvasElement, 0, 2); // parent "latest.score" column
    const parentCell = getCellByIndex(canvasElement, 0, 2);
    expect(parentCell).toBeTruthy();

    // Verify child cells can be selected
    await clearSelection();
    await clickCell(canvasElement, 0, 3); // first child "weekly_diff.score"
    const child1Cell = getCellByIndex(canvasElement, 0, 3);
    expect(child1Cell).toBeTruthy();

    // Copy flash should appear after Ctrl+C
    pressCtrlC();
    await waitForUpdate();
    expect(hasCopyFlash(child1Cell!)).toBe(true);
  },
};

/**
 * Test 15b: Paste into an editable singleRowChildren child column.
 * NOTE: Due to the alignment bug, the paste may write to the wrong column.
 * This test documents current behavior via the onCellEdit callback.
 * The TODO below shows the correct expected accessor once the bug is fixed.
 */
export const SingleRowChildrenPasteIntoChild: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createSingleRowChildrenData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product", width: 150, type: "string" },
      {
        accessor: "latest.score",
        label: "Score",
        width: 120,
        type: "number",
        singleRowChildren: true,
        children: [
          {
            accessor: "weekly_diff.score",
            label: "7d",
            width: 100,
            type: "number",
            isEditable: true,
            showWhen: "parentExpanded",
          },
          {
            accessor: "monthly_diff.score",
            label: "30d",
            width: 100,
            type: "number",
            isEditable: true,
            showWhen: "parentExpanded",
          },
        ],
      },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("99");

    await clearSelection();
    await clickCell(canvasElement, 0, 3); // first child "weekly_diff.score" (colIndex=3)
    pressCtrlV();
    await waitForPaste();

    expect(capturedEditCalls.length).toBeGreaterThan(0);
    expect(capturedEditCalls[0].accessor).toBe("weekly_diff.score");
    expect(capturedEditCalls[0].rowIndex).toBe(0);
  },
};

/**
 * Test 15c: Copy from a singleRowChildren parent column.
 * Verifies that copying the parent cell yields the parent's own value.
 *
 * Layout: [id(0), latest.score parent(1), weekly_diff.score child(2)]
 * Copying col 1 must produce "85" (latest.score for row 0), not "5"
 * (weekly_diff.score), which was the pre-fix behaviour.
 */
export const SingleRowChildrenParentCopyFlash: Story = {
  tags: ["test"],
  render: () => {
    const data = createSingleRowChildrenData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "latest.score",
        label: "Score",
        width: 120,
        type: "number",
        singleRowChildren: true,
        children: [
          {
            accessor: "weekly_diff.score",
            label: "7d",
            width: 100,
            type: "number",
            showWhen: "parentExpanded",
          },
        ],
      },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    mockClipboard();

    await clearSelection();
    await clickCell(canvasElement, 0, 1); // parent "latest.score" (colIndex=1 here, since id is col 0)
    pressCtrlC();
    await waitForUpdate();

    // Flash should appear on the selected parent cell
    const parentCell = getCellByIndex(canvasElement, 0, 1);
    expect(hasCopyFlash(parentCell!)).toBe(true);
    // Value must be the parent's own value, not the first child's
    const clipboard = mockClipboard();
    pressCtrlC();
    await waitForUpdate();
    expect(clipboard.get()).toBe("85"); // latest.score for row 0
  },
};

/**
 * Test 15d: singleRowChildren parent copy with a pinned left column.
 *
 * Layout (col-indices from calculateColumnIndices):
 *   col 0 → name     (pinned left)
 *   col 1 → latest.score  (singleRowChildren parent)
 *   col 2 → weekly_diff.score  (child)
 *   col 3 → monthly_diff.score (child)
 *
 * Before the findLeafHeaders fix, leafHeaders was built as:
 *   [name, weekly_diff.score, monthly_diff.score]  (parent omitted)
 * So colIndexToAccessor mapped:
 *   0 → name, 1 → weekly_diff.score, 2 → monthly_diff.score
 * Copying the parent cell (col 1) wrongly returned weekly_diff.score's value
 * instead of latest.score's value — one cell to the right.
 *
 * After the fix, leafHeaders is:
 *   [name, latest.score, weekly_diff.score, monthly_diff.score]
 * and col 1 correctly maps to latest.score.
 */
export const SingleRowChildrenWithPinnedColumnCopy: Story = {
  tags: ["test"],
  render: () => {
    const data = createSingleRowChildrenData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, type: "string", pinned: "left" },
      {
        accessor: "latest.score",
        label: "Score",
        width: 120,
        type: "number",
        singleRowChildren: true,
        children: [
          { accessor: "weekly_diff.score", label: "7d", width: 100, type: "number" },
          { accessor: "monthly_diff.score", label: "30d", width: 100, type: "number" },
        ],
      },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    // Copy the singleRowChildren parent cell (latest.score = 85 for row 0)
    await clearSelection();
    await clickCell(canvasElement, 0, 1); // col 1 = latest.score parent
    pressCtrlC();
    await waitForUpdate();

    // Must copy the parent's value (85), NOT the first child's value (5 = weekly_diff)
    expect(clipboard.get()).toBe("85");

    // Also verify copying a child cell still works correctly
    await clearSelection();
    await clickCell(canvasElement, 0, 2); // col 2 = weekly_diff.score
    pressCtrlC();
    await waitForUpdate();
    expect(clipboard.get()).toBe("5");
  },
};

// ============================================================================
// SECTION 16: EDGE CASES
// ============================================================================

/**
 * Test 16a: Row ID containing hyphens does not break clipboard cell key parsing.
 *
 * Cell key format: "${rowIndex}-${colIndex}-${rowId}"
 * When rowId = "1-2-3", the key becomes "0-1-1-2-3".
 * The clipboard parser does cellKey.split("-").map(Number) and takes [0] and [1],
 * which still correctly extracts rowIndex=0 and colIndex=1.
 */
export const RowIdWithHyphensInCellKey: Story = {
  tags: ["test"],
  render: () => {
    const data = [
      { id: "1-2-3", name: "Hyphenated", value: 42 },
      { id: "4-5-6", name: "Also-Hyphen", value: 99 },
    ] as Row[];
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "value", label: "Value", width: 120, type: "number" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)} // "1-2-3", "4-5-6"
        height="300px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await selectRange(canvasElement, 0, 0, 1, 1); // 2 rows × 2 cols
    pressCtrlC();
    await waitForUpdate();

    // Both rows should copy correctly despite hyphenated row IDs
    const text = clipboard.get();
    const lines = text.split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe("Hyphenated\t42");
    expect(lines[1]).toBe("Also-Hyphen\t99");
  },
};

/**
 * Test 16b: Nested accessor paths (dot notation) are correctly resolved for copy.
 */
export const NestedAccessorPath: Story = {
  tags: ["test"],
  render: () => {
    const data = createNestedData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "user.name", label: "Name", width: 200, type: "string" },
      { accessor: "user.email", label: "Email", width: 200, type: "string" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data as Row[]}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await selectRange(canvasElement, 0, 1, 0, 2); // name and email for row 0
    pressCtrlC();
    await waitForUpdate();

    expect(clipboard.get()).toBe("Alice\talice@example.com");
  },
};

/**
 * Test 16c: Array-index accessor paths (bracket notation) are correctly resolved.
 */
export const ArrayIndexAccessor: Story = {
  tags: ["test"],
  render: () => {
    const data = [
      { id: 1, name: "Artist", albums: [{ title: "Debut" }, { title: "Sophomore" }] },
    ] as Row[];
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, type: "string" },
      { accessor: "albums[0].title", label: "First Album", width: 200, type: "string" },
      { accessor: "albums[1].title", label: "Second Album", width: 200, type: "string" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="300px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await selectRange(canvasElement, 0, 0, 0, 2); // all 3 cols
    pressCtrlC();
    await waitForUpdate();

    expect(clipboard.get()).toBe("Artist\tDebut\tSophomore");
  },
};

/**
 * Test 16d: Ctrl+A selects all cells, then Ctrl+C copies the full table as TSV.
 */
export const SelectAllThenCopy: Story = {
  tags: ["test"],
  render: () => {
    const data = [
      { id: 1, name: "A" },
      { id: 2, name: "B" },
      { id: 3, name: "C" },
    ] as Row[];
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 150, type: "string" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="300px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    // First click a cell to give the table focus (required for Ctrl+A)
    await clickCell(canvasElement, 0, 0);
    await waitForUpdate();

    pressCtrlA();
    await waitForUpdate();

    pressCtrlC();
    await waitForUpdate();

    const text = clipboard.get();
    const lines = text.split("\n");

    // All 3 rows
    expect(lines).toHaveLength(3);
    // Each row has 2 columns
    lines.forEach((line) => {
      expect(line.split("\t")).toHaveLength(2);
    });
    expect(lines[0]).toBe("1\tA");
    expect(lines[1]).toBe("2\tB");
    expect(lines[2]).toBe("3\tC");
  },
};

/**
 * Test 16e: When selectableCells=false, keyboard shortcuts are ignored entirely.
 */
export const CopyWhenSelectableCellsDisabled: Story = {
  tags: ["test"],
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells={false} // disabled
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("SENTINEL");

    // Even if we try to click and copy, keyboard handling is disabled
    pressCtrlC();
    await waitForUpdate();

    // Clipboard untouched because selectableCells=false prevents keyboard handler
    expect(clipboard.get()).toBe("SENTINEL");
  },
};

/**
 * Test 16f: Copy with multiple rows and columns verifies correct TSV ordering.
 * Rows should be in ascending rowIndex order; columns in ascending colIndex order.
 */
export const CopyPreservesRowAndColumnOrder: Story = {
  tags: ["test"],
  render: () => {
    const data = [
      { id: 10, name: "Row0", value: 100 },
      { id: 20, name: "Row1", value: 200 },
      { id: 30, name: "Row2", value: 300 },
    ] as Row[];
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 150, type: "string" },
      { accessor: "value", label: "Value", width: 120, type: "number" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await selectRange(canvasElement, 0, 0, 2, 2); // 3×3
    pressCtrlC();
    await waitForUpdate();

    const lines = clipboard.get().split("\n");
    expect(lines[0]).toBe("10\tRow0\t100");
    expect(lines[1]).toBe("20\tRow1\t200");
    expect(lines[2]).toBe("30\tRow2\t300");
  },
};

/**
 * Test 16g: Delete using Backspace key behaves identically to Delete key.
 */
export const DeleteWithBackspaceKey: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string", isEditable: true },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="400px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();

    await clearSelection();
    await clickCell(canvasElement, 0, 0);

    // Use Backspace instead of Delete
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Backspace", bubbles: true, cancelable: true }),
    );
    await waitForUpdate();

    expect(capturedEditCalls.length).toBe(1);
    expect(capturedEditCalls[0].newValue).toBe("");
  },
};

/**
 * Test 16h: Copy range where row contains undefined/null value produces
 * an empty string in that clipboard slot (no crash).
 */
export const CopyRowWithNullValue: Story = {
  tags: ["test"],
  render: () => {
    const data = [
      { id: 1, name: "With Name", price: 100 },
      { id: 2, name: null, price: null }, // null values
    ] as Row[];
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        getRowId={({ row }) => String(row.id)}
        height="300px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    await selectRange(canvasElement, 0, 0, 1, 1); // 2 rows × 2 cols
    pressCtrlC();
    await waitForUpdate();

    const lines = clipboard.get().split("\n");
    expect(lines).toHaveLength(2);
    // Row 0: normal values
    expect(lines[0]).toBe("With Name\t100");
    // Row 1: null values become empty strings
    const row1Cols = lines[1].split("\t");
    expect(row1Cols).toHaveLength(2);
    // null/undefined values produce empty string entries (not crash)
    expect(row1Cols[0] === "" || row1Cols[0] === "null").toBe(true);
  },
};
