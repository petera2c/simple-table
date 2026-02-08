import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect } from "@storybook/test";
import { Row, SimpleTable } from "../..";
import { HeaderObject } from "../..";

// ============================================================================
// DATA INTERFACES
// ============================================================================

const createProductData = (): Row[] => {
  const products = [];
  for (let i = 1; i <= 20; i++) {
    products.push({
      id: i,
      name: `Product ${i}`,
      category: i % 3 === 0 ? "Electronics" : i % 2 === 0 ? "Clothing" : "Home",
      price: Math.floor(Math.random() * 500) + 50,
      stock: Math.floor(Math.random() * 100) + 10,
      rating: (Math.random() * 2 + 3).toFixed(1),
    });
  }
  return products;
};

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

const getCellElement = (
  canvasElement: HTMLElement,
  rowIndex: number,
  colIndex: number
): HTMLElement | null => {
  return canvasElement.querySelector(
    `[data-row-index="${rowIndex}"][data-col-index="${colIndex}"]`
  ) as HTMLElement;
};

const clickCell = async (
  canvasElement: HTMLElement,
  rowIndex: number,
  colIndex: number
): Promise<void> => {
  const cell = getCellElement(canvasElement, rowIndex, colIndex);
  expect(cell).toBeTruthy();

  const mouseDownEvent = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
  });
  cell!.dispatchEvent(mouseDownEvent);

  const mouseUpEvent = new MouseEvent("mouseup", {
    bubbles: true,
    cancelable: true,
  });
  cell!.dispatchEvent(mouseUpEvent);

  await new Promise((resolve) => setTimeout(resolve, 150));
};

const selectCellRange = async (
  canvasElement: HTMLElement,
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): Promise<void> => {
  const startCell = getCellElement(canvasElement, startRow, startCol);
  const endCell = getCellElement(canvasElement, endRow, endCol);

  expect(startCell).toBeTruthy();
  expect(endCell).toBeTruthy();

  // Mouse down on start cell
  const mouseDownEvent = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
  });
  startCell!.dispatchEvent(mouseDownEvent);

  await new Promise((resolve) => setTimeout(resolve, 10));

  // Mouse over cells in range
  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);

  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      const cell = getCellElement(canvasElement, row, col);
      if (cell) {
        const mouseOverEvent = new MouseEvent("mouseover", {
          bubbles: true,
          cancelable: true,
        });
        cell.dispatchEvent(mouseOverEvent);
        await new Promise((resolve) => setTimeout(resolve, 5));
      }
    }
  }

  // Mouse up on end cell
  const mouseUpEvent = new MouseEvent("mouseup", {
    bubbles: true,
    cancelable: true,
  });
  endCell!.dispatchEvent(mouseUpEvent);

  await new Promise((resolve) => setTimeout(resolve, 200));
};

const isCellSelected = (
  canvasElement: HTMLElement,
  rowIndex: number,
  colIndex: number
): boolean => {
  const cell = getCellElement(canvasElement, rowIndex, colIndex);
  return (
    cell?.classList.contains("st-cell-selected") ||
    cell?.classList.contains("st-cell-selected-first") ||
    false
  );
};

const getSelectedCellCount = (canvasElement: HTMLElement): number => {
  const selectedCells = canvasElement.querySelectorAll(
    ".st-cell-selected, .st-cell-selected-first"
  );
  return selectedCells.length;
};

const clearCellSelection = async (canvasElement: HTMLElement): Promise<void> => {
  const mouseDownEvent = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  document.body.dispatchEvent(mouseDownEvent);

  const escapeEvent = new KeyboardEvent("keydown", {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  document.dispatchEvent(escapeEvent);

  await new Promise((resolve) => setTimeout(resolve, 100));
};

const clickColumnHeader = async (
  canvasElement: HTMLElement,
  colIndex: number
): Promise<void> => {
  const headers = canvasElement.querySelectorAll(".st-header-cell");
  const header = headers[colIndex] as HTMLElement;
  expect(header).toBeTruthy();

  const headerLabel = header.querySelector(".st-header-label") as HTMLElement;
  expect(headerLabel).toBeTruthy();

  const clickEvent = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
  });
  headerLabel.dispatchEvent(clickEvent);

  await new Promise((resolve) => setTimeout(resolve, 150));
};

const isColumnSelected = (canvasElement: HTMLElement, colIndex: number): boolean => {
  const cellsInColumn = canvasElement.querySelectorAll(`[data-col-index="${colIndex}"]`);
  if (cellsInColumn.length === 0) return false;

  let selectedCount = 0;
  cellsInColumn.forEach((cell) => {
    if (
      cell.classList.contains("st-cell-selected") ||
      cell.classList.contains("st-cell-selected-first")
    ) {
      selectedCount++;
    }
  });

  return selectedCount > 0;
};

// ============================================================================
// STORYBOOK META
// ============================================================================

const meta: Meta<typeof SimpleTable> = {
  title: "Tests/12 - Cell Selection",
  component: SimpleTable,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof SimpleTable>;

// ============================================================================
// TEST CASES
// ============================================================================

/**
 * Test 1: Single Cell Selection
 * Tests that clicking a single cell selects it
 */
export const SingleCellSelection: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          selectableCells={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Clear any existing selection
    await clearCellSelection(canvasElement);

    // Click on a cell
    await clickCell(canvasElement, 0, 1);

    // Verify the cell is selected
    expect(isCellSelected(canvasElement, 0, 1)).toBe(true);

    // Verify only one cell is selected
    expect(getSelectedCellCount(canvasElement)).toBe(1);
  },
};

/**
 * Test 2: Range Selection
 * Tests that dragging across multiple cells selects a range
 */
export const RangeSelection: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          selectableCells={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Clear any existing selection
    await clearCellSelection(canvasElement);

    // Select a range of cells (2x2 grid)
    await selectCellRange(canvasElement, 0, 0, 1, 1);

    // Verify all cells in the range are selected (2 rows x 2 cols = 4 cells)
    expect(getSelectedCellCount(canvasElement)).toBe(4);

    // Verify specific cells are selected
    expect(isCellSelected(canvasElement, 0, 0)).toBe(true);
    expect(isCellSelected(canvasElement, 0, 1)).toBe(true);
    expect(isCellSelected(canvasElement, 1, 0)).toBe(true);
    expect(isCellSelected(canvasElement, 1, 1)).toBe(true);
  },
};

/**
 * Test 3: Selection Replacement
 * Tests that selecting a new cell replaces the previous selection
 */
export const SelectionReplacement: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          selectableCells={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Select first cell
    await clickCell(canvasElement, 0, 0);
    expect(isCellSelected(canvasElement, 0, 0)).toBe(true);
    expect(getSelectedCellCount(canvasElement)).toBe(1);

    // Select a different cell
    await clickCell(canvasElement, 2, 2);

    // Verify first cell is no longer selected
    expect(isCellSelected(canvasElement, 0, 0)).toBe(false);

    // Verify second cell is now selected
    expect(isCellSelected(canvasElement, 2, 2)).toBe(true);

    // Verify only one cell is selected
    expect(getSelectedCellCount(canvasElement)).toBe(1);
  },
};

/**
 * Test 4: Column Header Selection
 * Tests that clicking a column header selects the entire column
 */
export const ColumnHeaderSelection: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          selectableCells={true}
          selectableColumns={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Clear any existing selection
    await clearCellSelection(canvasElement);

    // Click on column header
    await clickColumnHeader(canvasElement, 1);

    // Verify the column is selected
    expect(isColumnSelected(canvasElement, 1)).toBe(true);

    // Verify multiple cells are selected (entire column)
    expect(getSelectedCellCount(canvasElement)).toBeGreaterThan(1);
  },
};

/**
 * Test 5: Clear Selection
 * Tests that clicking outside the table clears the selection
 */
export const ClearSelection: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          selectableCells={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Select a cell
    await clickCell(canvasElement, 0, 0);
    expect(getSelectedCellCount(canvasElement)).toBe(1);

    // Clear selection
    await clearCellSelection(canvasElement);

    // Verify no cells are selected
    expect(getSelectedCellCount(canvasElement)).toBe(0);
  },
};

/**
 * Test 6: Large Range Selection
 * Tests selecting a larger range of cells
 */
export const LargeRangeSelection: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
      { accessor: "stock", label: "Stock", width: 100, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          selectableCells={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Clear any existing selection
    await clearCellSelection(canvasElement);

    // Select a 3x3 range
    await selectCellRange(canvasElement, 0, 0, 2, 2);

    // Verify correct number of cells selected (3 rows x 3 cols = 9 cells)
    expect(getSelectedCellCount(canvasElement)).toBe(9);

    // Verify corner cells are selected
    expect(isCellSelected(canvasElement, 0, 0)).toBe(true);
    expect(isCellSelected(canvasElement, 0, 2)).toBe(true);
    expect(isCellSelected(canvasElement, 2, 0)).toBe(true);
    expect(isCellSelected(canvasElement, 2, 2)).toBe(true);

    // Verify middle cell is selected
    expect(isCellSelected(canvasElement, 1, 1)).toBe(true);
  },
};

/**
 * Test 7: Multiple Column Header Selections
 * Tests clicking different column headers sequentially
 */
export const MultipleColumnHeaderSelections: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          selectableCells={true}
          selectableColumns={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Click first column header
    await clickColumnHeader(canvasElement, 0);
    expect(isColumnSelected(canvasElement, 0)).toBe(true);

    // Click second column header (should replace selection)
    await clickColumnHeader(canvasElement, 1);
    expect(isColumnSelected(canvasElement, 1)).toBe(true);

    // Click third column header
    await clickColumnHeader(canvasElement, 2);
    expect(isColumnSelected(canvasElement, 2)).toBe(true);
  },
};
