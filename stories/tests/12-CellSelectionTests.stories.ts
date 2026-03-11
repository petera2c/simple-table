/**
 * CELL SELECTION TESTS
 * Ported from React - same tests, vanilla table only.
 */

import { SimpleTableVanilla } from "../../dist/index.es.js";
import { expect } from "@storybook/test";
import { waitForTable, getCellsForRow } from "./testUtils";
import { renderVanillaTable } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/12 - Cell Selection",
  parameters: { layout: "padded" },
};

export default meta;

const createProductData = (): { id: number; name: string; category: string; price: number; stock: number; rating: string }[] => {
  const products: { id: number; name: string; category: string; price: number; stock: number; rating: string }[] = [];
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

const getCellElement = (canvasElement: HTMLElement, rowIndex: number, colIndex: number): HTMLElement | null => {
  const cells = getCellsForRow(canvasElement, String(rowIndex));
  return cells[colIndex] || null;
};

const clickCell = async (canvasElement: HTMLElement, rowIndex: number, colIndex: number) => {
  const cell = getCellElement(canvasElement, rowIndex, colIndex);
  if (!cell) throw new Error(`Cell not found at row ${rowIndex}, col ${colIndex}`);
  cell.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
  cell.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
  await new Promise((r) => setTimeout(r, 150));
};

const selectCellRange = async (canvasElement: HTMLElement, startRow: number, startCol: number, endRow: number, endCol: number) => {
  const startCell = getCellElement(canvasElement, startRow, startCol);
  const endCell = getCellElement(canvasElement, endRow, endCol);
  if (!startCell || !endCell) return;
  startCell.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
  await new Promise((r) => setTimeout(r, 10));
  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      const cell = getCellElement(canvasElement, row, col);
      if (cell) {
        cell.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));
        await new Promise((r) => setTimeout(r, 5));
      }
    }
  }
  endCell.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
  await new Promise((r) => setTimeout(r, 200));
};

const isCellSelected = (canvasElement: HTMLElement, rowIndex: number, colIndex: number) => {
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
    ".st-cell-selected, .st-cell-selected-first, .st-cell-column-selected, .st-cell-column-selected-first"
  );
  return selected.length;
};

const clearCellSelection = async (canvasElement: HTMLElement) => {
  document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window }));
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
  await new Promise((r) => setTimeout(r, 100));
};

const clickColumnHeader = async (canvasElement: HTMLElement, colIndex: number) => {
  const headers = canvasElement.querySelectorAll(".st-header-cell");
  const header = headers[colIndex];
  expect(header).toBeTruthy();
  const headerLabel = header?.querySelector(".st-header-label");
  expect(headerLabel).toBeTruthy();
  headerLabel?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  await new Promise((r) => setTimeout(r, 150));
};

const isColumnSelected = (canvasElement: HTMLElement, colIndex: number) => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return false;
  const cells = bodyContainer.querySelectorAll(".st-cell[data-row-index]");
  const rowIndices = Array.from(new Set(Array.from(cells).map((c) => c.getAttribute("data-row-index")))).filter((x): x is string => x != null);
  for (const rowIndex of rowIndices) {
    const rowCells = getCellsForRow(canvasElement, rowIndex);
    const cell = rowCells[colIndex];
    if (cell?.classList.contains("st-cell-column-selected")) return true;
  }
  return false;
};

export const SingleCellSelection = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), { getRowId: (params) => String(params.row.id), height: "400px", selectableCells: true });
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
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), { getRowId: (params) => String(params.row.id), height: "400px", selectableCells: true });
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
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), { getRowId: (params) => String(params.row.id), height: "400px", selectableCells: true });
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
    const headers = [
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
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), { getRowId: (params) => String(params.row.id), height: "400px", selectableCells: true });
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
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: 200, type: "string" },
      { accessor: "category", label: "Category", width: 150, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
      { accessor: "stock", label: "Stock", width: 100, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createProductData(), { getRowId: (params) => String(params.row.id), height: "400px", selectableCells: true });
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
    const headers = [
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
