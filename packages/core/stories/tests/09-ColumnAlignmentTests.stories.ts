/**
 * COLUMN ALIGNMENT TESTS
 * Ported from React - same tests, vanilla table only.
 */

import { HeaderObject, SimpleTableVanilla } from "../../src/index";
import { expect } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/09-ColumnAlignmentTests",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Comprehensive tests for column alignment (left, center, right) and alignment with formatting.",
      },
    },
  },
};

export default meta;

const createProductData = () => [
  { id: 1, name: "Laptop", price: 1299.99, quantity: 15, status: "In Stock" },
  { id: 2, name: "Mouse", price: 29.99, quantity: 150, status: "In Stock" },
  { id: 3, name: "Keyboard", price: 89.99, quantity: 75, status: "Low Stock" },
  { id: 4, name: "Monitor", price: 399.99, quantity: 0, status: "Out of Stock" },
  { id: 5, name: "Webcam", price: 79.99, quantity: 45, status: "In Stock" },
];

const getHeaderCells = (canvasElement: HTMLElement) => Array.from(canvasElement.querySelectorAll(".st-header-cell"));
const getBodyRows = (canvasElement: HTMLElement): Element[][] => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return [];
  const cells = bodyContainer.querySelectorAll(".st-cell[data-row-index]");
  const rowMap = new Map<string, Element[]>();
  cells.forEach((cell) => {
    const rowIndex = cell.getAttribute("data-row-index");
    if (rowIndex) {
      if (!rowMap.has(rowIndex)) rowMap.set(rowIndex, []);
      rowMap.get(rowIndex)!.push(cell);
    }
  });
  return Array.from(rowMap.values());
};
const getCellsInRow = (rowCells: Element[]) => rowCells;
const getHeaderLabelText = (headerCell: Element) => headerCell.querySelector(".st-header-label-text");
const getCellContent = (cell: Element) => cell.querySelector(".st-cell-content");
const hasAlignmentClass = (element: Element | null, alignment: string) => {
  if (!element) return false;
  return element.classList.contains(`${alignment}-aligned`);
};
const getTextAlign = (element: Element | null) => (element ? window.getComputedStyle(element as HTMLElement).textAlign : "");
const getJustifyContent = (element: Element | null) => (element ? window.getComputedStyle(element as HTMLElement).justifyContent : "");

function renderAlignment(headers: HeaderObject[], options: Record<string, unknown> = {}) {
  const data = createProductData();
  const wrapper = document.createElement("div");
  wrapper.style.padding = "20px";
  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);
  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: headers,
    rows: data,
    getRowId: (params) => String(params.row?.id),
    height: "400px",
    ...options,
  });
  table.mount();
  return wrapper;
}

export const LeftAlignment = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "left", type: "number" },
      { accessor: "name", label: "Product Name", width: "1fr", align: "left", type: "string" },
      { accessor: "status", label: "Status", width: 150, align: "left", type: "string" },
    ];
    return renderAlignment(headers);
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);
    for (let i = 0; i < headerCells.length; i++) {
      const headerLabelText = getHeaderLabelText(headerCells[i]);
      expect(hasAlignmentClass(headerLabelText, "left")).toBe(true);
      expect(getTextAlign(headerLabelText)).toBe("left");
    }
    const rows = getBodyRows(canvasElement);
    expect(rows.length).toBeGreaterThan(0);
    const firstRow = rows[0];
    const cells = getCellsInRow(firstRow);
    expect(cells.length).toBe(3);
    for (let i = 0; i < cells.length; i++) {
      const cellContent = getCellContent(cells[i]);
      expect(hasAlignmentClass(cellContent, "left")).toBe(true);
      expect(getTextAlign(cellContent)).toBe("left");
      expect(getJustifyContent(cellContent)).toMatch(/flex-start|start/);
    }
  },
};

export const CenterAlignment = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "center", type: "number" },
      { accessor: "name", label: "Product Name", width: "1fr", align: "center", type: "string" },
      { accessor: "status", label: "Status", width: 150, align: "center", type: "string" },
    ];
    return renderAlignment(headers);
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);
    for (let i = 0; i < headerCells.length; i++) {
      const headerLabelText = getHeaderLabelText(headerCells[i]);
      expect(hasAlignmentClass(headerLabelText, "center")).toBe(true);
      expect(getTextAlign(headerLabelText)).toBe("center");
    }
    const rows = getBodyRows(canvasElement);
    expect(rows.length).toBeGreaterThan(0);
    const firstRow = rows[0];
    const cells = getCellsInRow(firstRow);
    expect(cells.length).toBe(3);
    for (let i = 0; i < cells.length; i++) {
      const cellContent = getCellContent(cells[i]);
      expect(hasAlignmentClass(cellContent, "center")).toBe(true);
      expect(getTextAlign(cellContent)).toBe("center");
      expect(getJustifyContent(cellContent)).toBe("center");
    }
  },
};

export const RightAlignment = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "right", type: "number" },
      { accessor: "price", label: "Price", width: 120, align: "right", type: "number" },
      { accessor: "quantity", label: "Quantity", width: 120, align: "right", type: "number" },
    ];
    return renderAlignment(headers);
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);
    for (let i = 0; i < headerCells.length; i++) {
      const headerLabelText = getHeaderLabelText(headerCells[i]);
      expect(hasAlignmentClass(headerLabelText, "right")).toBe(true);
      expect(getTextAlign(headerLabelText)).toBe("right");
    }
    const rows = getBodyRows(canvasElement);
    expect(rows.length).toBeGreaterThan(0);
    const firstRow = rows[0];
    const cells = getCellsInRow(firstRow);
    expect(cells.length).toBe(3);
    for (let i = 0; i < cells.length; i++) {
      const cellContent = getCellContent(cells[i]);
      expect(hasAlignmentClass(cellContent, "right")).toBe(true);
      expect(getTextAlign(cellContent)).toBe("right");
      expect(getJustifyContent(cellContent)).toMatch(/flex-end|end/);
    }
  },
};

export const MixedAlignment = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "left", type: "number" },
      { accessor: "name", label: "Product Name", width: "1fr", align: "left", type: "string" },
      { accessor: "status", label: "Status", width: 150, align: "center", type: "string" },
      { accessor: "quantity", label: "Quantity", width: 120, align: "right", type: "number" },
      { accessor: "price", label: "Price", width: 120, align: "right", type: "number" },
    ];
    return renderAlignment(headers);
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(5);
    const expectedAlignments = ["left", "left", "center", "right", "right"];
    for (let i = 0; i < headerCells.length; i++) {
      const headerLabelText = getHeaderLabelText(headerCells[i]);
      expect(hasAlignmentClass(headerLabelText, expectedAlignments[i])).toBe(true);
    }
    const rows = getBodyRows(canvasElement);
    expect(rows.length).toBeGreaterThan(0);
    const firstRow = rows[0];
    const cells = getCellsInRow(firstRow);
    expect(cells.length).toBe(5);
    for (let i = 0; i < cells.length; i++) {
      const cellContent = getCellContent(cells[i]);
      expect(hasAlignmentClass(cellContent, expectedAlignments[i])).toBe(true);
    }
  },
};

export const DefaultAlignment = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: "1fr", type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    return renderAlignment(headers);
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);
    for (let i = 0; i < headerCells.length; i++) {
      const headerLabelText = getHeaderLabelText(headerCells[i]);
      expect(hasAlignmentClass(headerLabelText, "left")).toBe(true);
    }
    const rows = getBodyRows(canvasElement);
    expect(rows.length).toBeGreaterThan(0);
    const firstRow = rows[0];
    const cells = getCellsInRow(firstRow);
    expect(cells.length).toBe(3);
    for (let i = 0; i < cells.length; i++) {
      const cellContent = getCellContent(cells[i]);
      expect(hasAlignmentClass(cellContent, "left")).toBe(true);
    }
  },
};

export const AlignmentWithSorting = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "left", isSortable: true, type: "number" },
      { accessor: "name", label: "Product Name", width: "1fr", align: "left", isSortable: true, type: "string" },
      { accessor: "price", label: "Price", width: 120, align: "right", isSortable: true, type: "number" },
    ];
    return renderAlignment(headers);
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);
    expect(hasAlignmentClass(getHeaderLabelText(headerCells[0]), "left")).toBe(true);
    expect(hasAlignmentClass(getHeaderLabelText(headerCells[1]), "left")).toBe(true);
    expect(hasAlignmentClass(getHeaderLabelText(headerCells[2]), "right")).toBe(true);
    expect(headerCells[0].classList.contains("clickable")).toBe(true);
    expect(headerCells[1].classList.contains("clickable")).toBe(true);
    expect(headerCells[2].classList.contains("clickable")).toBe(true);
  },
};

export const AlignmentWithFiltering = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "left", filterable: true, type: "number" },
      { accessor: "name", label: "Product Name", width: "1fr", align: "center", filterable: true, type: "string" },
      { accessor: "price", label: "Price", width: 120, align: "right", filterable: true, type: "number" },
    ];
    return renderAlignment(headers);
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);
    expect(hasAlignmentClass(getHeaderLabelText(headerCells[0]), "left")).toBe(true);
    expect(hasAlignmentClass(getHeaderLabelText(headerCells[1]), "center")).toBe(true);
    expect(hasAlignmentClass(getHeaderLabelText(headerCells[2]), "right")).toBe(true);
  },
};

export const AlignmentConsistencyAcrossRows = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "center", type: "number" },
      { accessor: "name", label: "Product Name", width: "1fr", align: "left", type: "string" },
      { accessor: "price", label: "Price", width: 120, align: "right", type: "number" },
    ];
    return renderAlignment(headers);
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const rows = getBodyRows(canvasElement);
    expect(rows.length).toBe(5);
    const expectedAlignments = ["center", "left", "right"];
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const cells = getCellsInRow(rows[rowIndex]);
      expect(cells.length).toBe(3);
      for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
        const cellContent = getCellContent(cells[cellIndex]);
        expect(hasAlignmentClass(cellContent, expectedAlignments[cellIndex])).toBe(true);
      }
    }
  },
};

export const AlignmentWithNumberTypes = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "left", type: "number" },
      { accessor: "quantity", label: "Qty (Center)", width: 120, align: "center", type: "number" },
      { accessor: "price", label: "Price (Right)", width: 120, align: "right", type: "number" },
    ];
    return renderAlignment(headers);
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);
    expect(hasAlignmentClass(getHeaderLabelText(headerCells[0]), "left")).toBe(true);
    expect(hasAlignmentClass(getHeaderLabelText(headerCells[1]), "center")).toBe(true);
    expect(hasAlignmentClass(getHeaderLabelText(headerCells[2]), "right")).toBe(true);
    const rows = getBodyRows(canvasElement);
    const firstRow = rows[0];
    const cells = getCellsInRow(firstRow);
    expect(hasAlignmentClass(getCellContent(cells[0]), "left")).toBe(true);
    expect(hasAlignmentClass(getCellContent(cells[1]), "center")).toBe(true);
    expect(hasAlignmentClass(getCellContent(cells[2]), "right")).toBe(true);
  },
};
