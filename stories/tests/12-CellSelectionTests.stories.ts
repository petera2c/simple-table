/**
 * CELL SELECTION TESTS
 * Ported from React - same tests, vanilla table only.
 */

import { HeaderObject } from "../../src/index";
import { expect } from "@storybook/test";
import { waitForTable, getCellsForRow } from "./testUtils";
import { renderVanillaTable } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/12 - Cell Selection",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Comprehensive tests for cell selection including range selection and selection API.",
      },
    },
  },
};

export default meta;

const createProductData = (): {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: string;
}[] => {
  const products: {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    rating: string;
  }[] = [];
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

const getCellElement = (
  canvasElement: HTMLElement,
  rowIndex: number,
  colIndex: number,
): HTMLElement | null => {
  const cells = getCellsForRow(canvasElement, String(rowIndex));
  return cells[colIndex] || null;
};

const clickCell = async (
  canvasElement: HTMLElement,
  rowIndex: number,
  colIndex: number,
) => {
  const cell = getCellElement(canvasElement, rowIndex, colIndex);
  if (!cell)
    throw new Error(`Cell not found at row ${rowIndex}, col ${colIndex}`);
  cell.dispatchEvent(
    new MouseEvent("mousedown", { bubbles: true, cancelable: true }),
  );
  cell.dispatchEvent(
    new MouseEvent("mouseup", { bubbles: true, cancelable: true }),
  );
  await new Promise((r) => setTimeout(r, 150));
};

const selectCellRange = async (
  canvasElement: HTMLElement,
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
) => {
  const startCell = getCellElement(canvasElement, startRow, startCol);
  const endCell = getCellElement(canvasElement, endRow, endCol);
  if (!startCell || !endCell) return;
  startCell.dispatchEvent(
    new MouseEvent("mousedown", { bubbles: true, cancelable: true }),
  );
  await new Promise((r) => setTimeout(r, 10));
  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      const cell = getCellElement(canvasElement, row, col);
      if (cell) {
        cell.dispatchEvent(
          new MouseEvent("mouseover", { bubbles: true, cancelable: true }),
        );
        await new Promise((r) => setTimeout(r, 5));
      }
    }
  }
  endCell.dispatchEvent(
    new MouseEvent("mouseup", { bubbles: true, cancelable: true }),
  );
  await new Promise((r) => setTimeout(r, 200));
};

const isCellSelected = (
  canvasElement: HTMLElement,
  rowIndex: number,
  colIndex: number,
) => {
  const cell = getCellElement(canvasElement, rowIndex, colIndex);
  if (!cell) return false;
  return (
    cell.classList.contains("st-cell-selected") ||
    cell.classList.contains("st-cell-selected-first") ||
    cell.classList.contains("st-cell-column-selected") ||
    cell.classList.contains("st-cell-column-selected-first") ||
    false
  );
};

const getSelectedCellCount = (canvasElement: HTMLElement) => {
  const selected = canvasElement.querySelectorAll(
    ".st-cell-selected, .st-cell-selected-first, .st-cell-column-selected, .st-cell-column-selected-first",
  );
  return selected.length;
};

/** Number of cells that have the anchor/first-cell selection class. Should be 1 when a range is selected. */
const getSelectedFirstCellCount = (canvasElement: HTMLElement) => {
  return canvasElement.querySelectorAll(".st-cell-selected-first").length;
};

const clearCellSelection = async (canvasElement: HTMLElement) => {
  document.body.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    }),
  );
  await new Promise((r) => setTimeout(r, 100));
};

/** True if the cell has individual cell selection (not only column selection). */
const isCellIndividuallySelected = (
  canvasElement: HTMLElement,
  rowIndex: number,
  colIndex: number,
) => {
  const cell = getCellElement(canvasElement, rowIndex, colIndex);
  if (!cell) return false;
  return (
    cell.classList.contains("st-cell-selected") ||
    cell.classList.contains("st-cell-selected-first") ||
    false
  );
};

/** Dispatch mousedown outside the table (e.g. on body) to test outside-click-clears-selection. */
const clickOutsideTable = async (canvasElement: HTMLElement) => {
  document.body.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );
  await new Promise((r) => setTimeout(r, 100));
};

const clickColumnHeader = async (
  canvasElement: HTMLElement,
  colIndex: number,
) => {
  const headers = canvasElement.querySelectorAll(".st-header-cell");
  const header = headers[colIndex];
  expect(header).toBeTruthy();
  const headerLabel = header?.querySelector(".st-header-label");
  expect(headerLabel).toBeTruthy();
  headerLabel?.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );
  await new Promise((r) => setTimeout(r, 150));
};

const isColumnSelected = (canvasElement: HTMLElement, colIndex: number) => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return false;
  const cells = bodyContainer.querySelectorAll(".st-cell[data-row-index]");
  const rowIndices = Array.from(
    new Set(Array.from(cells).map((c) => c.getAttribute("data-row-index"))),
  ).filter((x): x is string => x != null);
  for (const rowIndex of rowIndices) {
    const rowCells = getCellsForRow(canvasElement, rowIndex);
    const cell = rowCells[colIndex];
    if (cell?.classList.contains("st-cell-column-selected")) return true;
  }
  return false;
};

export const SingleCellSelection = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), {
      getRowId: (params) => String(params.row.id),
      height: "400px",
      selectableCells: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clearCellSelection(canvasElement);
    await clickCell(canvasElement, 0, 1);
    expect(isCellSelected(canvasElement, 0, 1)).toBe(true);
    expect(getSelectedCellCount(canvasElement)).toBe(1);
  },
};

export const RangeSelection = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), {
      getRowId: (params) => String(params.row.id),
      height: "400px",
      selectableCells: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clearCellSelection(canvasElement);
    await selectCellRange(canvasElement, 0, 0, 1, 1);
    expect(getSelectedCellCount(canvasElement)).toBe(4);
    expect(isCellSelected(canvasElement, 0, 0)).toBe(true);
    expect(isCellSelected(canvasElement, 0, 1)).toBe(true);
    expect(isCellSelected(canvasElement, 1, 0)).toBe(true);
    expect(isCellSelected(canvasElement, 1, 1)).toBe(true);
  },
};

export const SelectionReplacement = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), {
      getRowId: (params) => String(params.row.id),
      height: "400px",
      selectableCells: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clickCell(canvasElement, 0, 0);
    expect(isCellSelected(canvasElement, 0, 0)).toBe(true);
    expect(getSelectedCellCount(canvasElement)).toBe(1);
    await clickCell(canvasElement, 2, 2);
    expect(isCellSelected(canvasElement, 0, 0)).toBe(false);
    expect(isCellSelected(canvasElement, 2, 2)).toBe(true);
    expect(getSelectedCellCount(canvasElement)).toBe(1);
  },
};

export const ColumnHeaderSelection = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), {
      getRowId: (params) => String(params.row.id),
      height: "400px",
      selectableCells: true,
      selectableColumns: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clearCellSelection(canvasElement);
    await clickColumnHeader(canvasElement, 1);
    expect(isColumnSelected(canvasElement, 1)).toBe(true);
    expect(getSelectedCellCount(canvasElement)).toBeGreaterThan(1);
  },
};

export const ClearSelection = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), {
      getRowId: (params) => String(params.row.id),
      height: "400px",
      selectableCells: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clickCell(canvasElement, 0, 0);
    expect(getSelectedCellCount(canvasElement)).toBe(1);
    await clearCellSelection(canvasElement);
    expect(getSelectedCellCount(canvasElement)).toBe(0);
  },
};

export const LargeRangeSelection = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
      { accessor: "stock", label: "Stock", width: 100, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), {
      getRowId: (params) => String(params.row.id),
      height: "400px",
      selectableCells: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clearCellSelection(canvasElement);
    await selectCellRange(canvasElement, 0, 0, 2, 2);
    expect(getSelectedCellCount(canvasElement)).toBe(9);
    expect(isCellSelected(canvasElement, 0, 0)).toBe(true);
    expect(isCellSelected(canvasElement, 0, 2)).toBe(true);
    expect(isCellSelected(canvasElement, 2, 0)).toBe(true);
    expect(isCellSelected(canvasElement, 2, 2)).toBe(true);
    expect(isCellSelected(canvasElement, 1, 1)).toBe(true);
  },
};

export const MultipleColumnHeaderSelections = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), {
      getRowId: (params) => String(params.row.id),
      height: "400px",
      selectableCells: true,
      selectableColumns: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clickColumnHeader(canvasElement, 0);
    expect(isColumnSelected(canvasElement, 0)).toBe(true);
    await clickColumnHeader(canvasElement, 1);
    expect(isColumnSelected(canvasElement, 1)).toBe(true);
    await clickColumnHeader(canvasElement, 2);
    expect(isColumnSelected(canvasElement, 2)).toBe(true);
  },
};

/**
 * Edge case: clicking outside the table (e.g. on document.body) should clear cell selection
 * and startCell, without needing to press Escape.
 */
export const OutsideClickClearsSelection = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), {
      getRowId: (params) => String(params.row.id),
      height: "400px",
      selectableCells: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clearCellSelection(canvasElement);
    await clickCell(canvasElement, 0, 1);
    expect(getSelectedCellCount(canvasElement)).toBe(1);
    expect(isCellSelected(canvasElement, 0, 1)).toBe(true);
    await clickOutsideTable(canvasElement);
    expect(getSelectedCellCount(canvasElement)).toBe(0);
    expect(isCellSelected(canvasElement, 0, 1)).toBe(false);
  },
};

/**
 * Edge case: when selectableColumns is true, clicking a column header should clear
 * any existing cell selection (and initial focused cell) so that column selection takes over.
 */
export const ColumnHeaderClickClearsCellSelection = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), {
      getRowId: (params) => String(params.row.id),
      height: "400px",
      selectableCells: true,
      selectableColumns: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clearCellSelection(canvasElement);
    await clickCell(canvasElement, 0, 1);
    expect(isCellIndividuallySelected(canvasElement, 0, 1)).toBe(true);
    await clickColumnHeader(canvasElement, 1);
    expect(isCellIndividuallySelected(canvasElement, 0, 1)).toBe(false);
  },
};

/**
 * Drag scroll: select a cell, then drag the cursor below the table.
 * The table should auto-scroll down and extend the selection as new rows come into view.
 */
export const SelectionDragScroll = {
  tags: ["selection-drag-scroll-only"],
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), {
      getRowId: (params) => String(params.row.id),
      height: "280px",
      selectableCells: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clearCellSelection(canvasElement);

    const bodyContainer = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLDivElement;
    expect(bodyContainer).toBeTruthy();
    const initialScrollTop = bodyContainer.scrollTop;

    const startCell = getCellElement(canvasElement, 0, 0);
    expect(startCell).toBeTruthy();
    startCell!.dispatchEvent(
      new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window,
      }),
    );
    await new Promise((r) => setTimeout(r, 20));

    const rect = bodyContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const belowTableY = rect.bottom + 60;

    document.dispatchEvent(
      new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: centerX,
        clientY: belowTableY,
      }),
    );
    await new Promise((r) => setTimeout(r, 120));
    document.dispatchEvent(
      new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: centerX,
        clientY: belowTableY + 40,
      }),
    );
    await new Promise((r) => setTimeout(r, 120));
    document.dispatchEvent(
      new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        view: window,
      }),
    );
    expect(bodyContainer.scrollTop).toBeGreaterThan(initialScrollTop);
    expect(getSelectedCellCount(canvasElement)).toBeGreaterThan(1);
  },
};

/**
 * After selecting a range at the bottom, scroll slightly and verify the anchor cell
 * (st-cell-selected-first) is still present. Regression test for first-cell class
 * being lost after scroll.
 */
export const SelectionFirstCellAfterScroll = {
  tags: ["selection-first-cell-after-scroll"],
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), {
      getRowId: (params) => String(params.row.id),
      height: "280px",
      selectableCells: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clearCellSelection(canvasElement);

    const bodyContainer = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLDivElement;
    expect(bodyContainer).toBeTruthy();

    // Scroll to bottom
    bodyContainer.scrollTop =
      bodyContainer.scrollHeight - bodyContainer.clientHeight;
    await new Promise((r) => setTimeout(r, 150));

    // Drag-select 4 cells (2x2) in the visible area at the bottom
    await selectCellRange(canvasElement, 0, 0, 1, 1);
    await new Promise((r) => setTimeout(r, 100));

    expect(getSelectedCellCount(canvasElement)).toBeGreaterThanOrEqual(4);
    expect(getSelectedFirstCellCount(canvasElement)).toBe(1);

    // Scroll slightly down
    bodyContainer.scrollTop += 30;
    await new Promise((r) => setTimeout(r, 150));

    // Scroll slightly up
    bodyContainer.scrollTop -= 20;
    await new Promise((r) => setTimeout(r, 150));

    // First cell (anchor) should still have st-cell-selected-first after scroll up
    expect(getSelectedFirstCellCount(canvasElement)).toBe(1);

    // Scroll down slightly again
    bodyContainer.scrollTop += 25;
    await new Promise((r) => setTimeout(r, 150));

    // st-cell-selected-first should still be present after scroll down
    expect(getSelectedFirstCellCount(canvasElement)).toBe(1);
  },
};

// ---------------------------------------------------------------------------
// copyHeadersToClipboard
// ---------------------------------------------------------------------------

const simpleData = () => [
  { id: 1, name: "Alice", score: 90 },
  { id: 2, name: "Bob", score: 85 },
];

export const CopySelectionWithHeaders = {
  parameters: { tags: ["fail-copy-selection-with-headers"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 120, type: "string" },
      { accessor: "score", label: "Score", width: 80, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, simpleData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      selectableCells: true,
      copyHeadersToClipboard: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    let copiedText = "";
    const originalWrite = navigator.clipboard?.writeText;
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      (navigator.clipboard as { writeText: (t: string) => Promise<void> }).writeText = (t: string) => {
        copiedText = t;
        return Promise.resolve();
      };
    }
    await clickCell(canvasElement, 0, 0);
    expect(isCellSelected(canvasElement, 0, 0)).toBe(true);
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "c",
        code: "KeyC",
        metaKey: true,
        bubbles: true,
        cancelable: true,
      })
    );
    await new Promise((r) => setTimeout(r, 100));
    if (navigator.clipboard && originalWrite) {
      (navigator.clipboard as { writeText: (t: string) => Promise<void> }).writeText = originalWrite;
    }
    expect(copiedText).toBeTruthy();
    const firstLine = copiedText.split("\n")[0];
    expect(firstLine).toContain("ID");
    expect(firstLine).toContain("Name");
    expect(copiedText.split("\n").length).toBeGreaterThanOrEqual(2);
  },
};

export const CopySelectionWithoutHeaders = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 120, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, simpleData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      selectableCells: true,
      copyHeadersToClipboard: false,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    let copiedText = "";
    const originalWrite = navigator.clipboard?.writeText;
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      (navigator.clipboard as { writeText: (t: string) => Promise<void> }).writeText = (t: string) => {
        copiedText = t;
        return Promise.resolve();
      };
    }
    await clickCell(canvasElement, 0, 1);
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "c",
        code: "KeyC",
        metaKey: true,
        bubbles: true,
        cancelable: true,
      })
    );
    await new Promise((r) => setTimeout(r, 100));
    if (navigator.clipboard && originalWrite) {
      (navigator.clipboard as { writeText: (t: string) => Promise<void> }).writeText = originalWrite;
    }
    expect(copiedText).toBeTruthy();
    const firstLine = copiedText.split("\n")[0];
    expect(firstLine).not.toContain("ID");
    expect(firstLine).not.toContain("Name");
  },
};
