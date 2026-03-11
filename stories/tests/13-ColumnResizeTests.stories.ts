/**
 * COLUMN RESIZE TESTS
 * Ported from React - same tests, vanilla table only.
 */

import { SimpleTableVanilla } from "../../dist/index.es.js";
import { expect } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/13 - Column Resize",
  parameters: { layout: "padded" },
};

export default meta;

const createStoreData = () => [
  { id: 1, storeName: "Downtown Store", city: "New York", squareFootage: 5000, openingDate: "2020-01-15", customerRating: 4.5 },
  { id: 2, storeName: "Westside Mall", city: "Los Angeles", squareFootage: 7500, openingDate: "2019-06-20", customerRating: 4.2 },
  { id: 3, storeName: "Central Plaza", city: "Chicago", squareFootage: 6200, openingDate: "2021-03-10", customerRating: 4.7 },
];

const getHeaderCells = (canvasElement: HTMLElement) => Array.from(canvasElement.querySelectorAll(".st-header-cell"));

const findHeaderCellByLabel = (canvasElement: HTMLElement, label: string): Element | null => {
  const headers = getHeaderCells(canvasElement);
  for (const header of headers) {
    const labelElement = header.querySelector(".st-header-label-text");
    if (labelElement?.textContent?.trim() === label) return header;
  }
  return null;
};

const resizeColumn = async (headerCell: Element, resizeAmount: number) => {
  const initialWidth = headerCell.getBoundingClientRect().width;
  const resizeHandle = headerCell.querySelector(".st-header-resize-handle-container");
  if (!resizeHandle) throw new Error("Resize handle not found");
  const startX = resizeHandle.getBoundingClientRect().left + 5;
  const endX = startX + resizeAmount;
  const mouseDownEvent = new MouseEvent("mousedown", {
    clientX: startX,
    clientY: resizeHandle.getBoundingClientRect().top + 5,
    bubbles: true,
    cancelable: true,
  });
  const mouseMoveEvent = new MouseEvent("mousemove", {
    clientX: endX,
    clientY: resizeHandle.getBoundingClientRect().top + 5,
    bubbles: true,
    cancelable: true,
  });
  const mouseUpEvent = new MouseEvent("mouseup", {
    clientX: endX,
    clientY: resizeHandle.getBoundingClientRect().top + 5,
    bubbles: true,
    cancelable: true,
  });
  resizeHandle.dispatchEvent(mouseDownEvent);
  document.dispatchEvent(mouseMoveEvent);
  document.dispatchEvent(mouseUpEvent);
  await new Promise((r) => setTimeout(r, 100));
  const finalWidth = headerCell.getBoundingClientRect().width;
  return { initialWidth, finalWidth };
};

export const BasicColumnResize = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (params) => String(params.row.id), height: "400px", columnResizing: true });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const storeNameHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeNameHeader).toBeTruthy();
    const resizeAmount = 50;
    const { initialWidth, finalWidth } = await resizeColumn(storeNameHeader!, resizeAmount);
    const widthChange = finalWidth - initialWidth;
    expect(Math.abs(widthChange - resizeAmount)).toBeLessThan(5);
  },
};

export const ResizeMultipleColumns = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (params) => String(params.row.id), height: "400px", columnResizing: true });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const idHeader = findHeaderCellByLabel(canvasElement, "ID");
    expect(idHeader).toBeTruthy();
    const { initialWidth: idInitial, finalWidth: idFinal } = await resizeColumn(idHeader!, 20);
    expect(idFinal - idInitial).toBeGreaterThan(15);
    const storeNameHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeNameHeader).toBeTruthy();
    const { initialWidth: storeInitial, finalWidth: storeFinal } = await resizeColumn(storeNameHeader!, 30);
    expect(storeFinal - storeInitial).toBeGreaterThan(25);
    const cityHeader = findHeaderCellByLabel(canvasElement, "City");
    expect(cityHeader).toBeTruthy();
    const { initialWidth: cityInitial, finalWidth: cityFinal } = await resizeColumn(cityHeader!, 40);
    expect(cityFinal - cityInitial).toBeGreaterThan(35);
  },
};

export const ResizeToSmallerWidth = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 150, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 300, type: "string" },
      { accessor: "city", label: "City", width: 200, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (params) => String(params.row.id), height: "400px", columnResizing: true });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const storeNameHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeNameHeader).toBeTruthy();
    const resizeAmount = -50;
    const { initialWidth, finalWidth } = await resizeColumn(storeNameHeader!, resizeAmount);
    expect(finalWidth).toBeLessThan(initialWidth);
    const widthChange = finalWidth - initialWidth;
    expect(Math.abs(widthChange - resizeAmount)).toBeLessThan(5);
  },
};

export const ResizeWithMinWidth = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 150, minWidth: 100, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 300, minWidth: 200, type: "string" },
      { accessor: "city", label: "City", width: 200, minWidth: 150, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (params) => String(params.row.id), height: "400px", columnResizing: true });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const storeNameHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeNameHeader).toBeTruthy();
    const { finalWidth } = await resizeColumn(storeNameHeader!, -150);
    expect(finalWidth).toBeGreaterThanOrEqual(195);
  },
};

export const ResizeAllColumns = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
      { accessor: "openingDate", label: "Opening Date", width: 150, type: "string" },
      { accessor: "customerRating", label: "Customer Rating", width: 150, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (params) => String(params.row.id), height: "400px", columnResizing: true });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const columnLabels = ["ID", "Store Name", "City", "Square Footage", "Opening Date", "Customer Rating"];
    for (const label of columnLabels) {
      const header = findHeaderCellByLabel(canvasElement, label);
      expect(header).toBeTruthy();
      const { initialWidth, finalWidth } = await resizeColumn(header!, 20);
      const widthChange = finalWidth - initialWidth;
      expect(Math.abs(widthChange - 20)).toBeLessThan(5);
    }
  },
};
