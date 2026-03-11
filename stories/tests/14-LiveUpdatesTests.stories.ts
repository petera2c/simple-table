/**
 * LIVE UPDATES TESTS
 * Ported from React - same tests, vanilla table only.
 * Tests updateData API and cell update flash.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject, SimpleTableVanilla } from "../../src/index";
import { waitForTable } from "./testUtils";

const meta: Meta = {
  title: "Tests/14 - Live Updates",
  parameters: { layout: "padded" },
};

export default meta;

const getCellElement = (rowIndex: number, accessor: string): Element | null =>
  document.querySelector(`[data-row-index="${rowIndex}"][data-accessor="${accessor}"]`);

const getCellValue = (rowIndex: number, accessor: string): string | null => {
  const cell = getCellElement(rowIndex, accessor);
  const contentSpan = cell?.querySelector(".st-cell-content");
  return contentSpan?.textContent ?? null;
};

const hasCellUpdatingClass = (rowIndex: number, accessor: string): boolean =>
  getCellElement(rowIndex, accessor)?.classList.contains("st-cell-updating") ?? false;

let testTableApi: ReturnType<SimpleTableVanilla["getAPI"]> | null = null;

function renderLiveUpdatesTable() {
  const wrapper = document.createElement("div");
  wrapper.style.padding = "20px";
  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);

  const headers: HeaderObject[] = [
    { accessor: "id", label: "ID", width: 60, type: "number" },
    { accessor: "product", label: "Product", width: 180, type: "string" },
    {
      accessor: "price",
      label: "Price",
      width: "1fr",
      type: "number",
      valueFormatter: ({ value }) => (typeof value === "number" ? `$${value.toFixed(2)}` : "$0.00"),
    },
    { accessor: "stock", label: "In Stock", width: 120, type: "number" },
    { accessor: "sales", label: "Sales", width: 120, type: "number" },
  ];

  const initialData = [
    { id: 1, product: "Widget A", price: 19.99, stock: 42, sales: 120 },
    { id: 2, product: "Widget B", price: 24.99, stock: 28, sales: 85 },
    { id: 3, product: "Widget C", price: 34.99, stock: 15, sales: 63 },
  ];

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: headers,
    rows: initialData,
    getRowId: (params) => String(params.row?.id),
    height: "400px",
    cellUpdateFlash: true,
  });
  table.mount();
  testTableApi = table.getAPI();
  return wrapper;
}

export const UpdateDataAPIPrice = {
  render: () => renderLiveUpdatesTable(),
  play: async () => {
    await waitForTable();
    await new Promise((r) => setTimeout(r, 500));
    expect(testTableApi).toBeTruthy();
    const initialPrice = getCellValue(0, "price");
    expect(initialPrice).toBeTruthy();
    testTableApi?.updateData({ accessor: "price", rowIndex: 0, newValue: 99.99 });
    await new Promise((r) => setTimeout(r, 200));
    const updatedPrice = getCellValue(0, "price");
    expect(updatedPrice).toBe("$99.99");
    expect(updatedPrice).not.toBe(initialPrice);
  },
};

export const FlashAnimationDetection = {
  render: () => renderLiveUpdatesTable(),
  play: async () => {
    await waitForTable();
    await new Promise((r) => setTimeout(r, 500));
    expect(testTableApi).toBeTruthy();
    expect(hasCellUpdatingClass(1, "price")).toBe(false);
    testTableApi?.updateData({ accessor: "price", rowIndex: 1, newValue: 88.88 });
    await new Promise((r) => setTimeout(r, 50));
    expect(hasCellUpdatingClass(1, "price")).toBe(true);
    await new Promise((r) => setTimeout(r, 1000));
    expect(hasCellUpdatingClass(1, "price")).toBe(false);
  },
};

export const UpdateDataAPIStock = {
  render: () => renderLiveUpdatesTable(),
  play: async () => {
    await waitForTable();
    await new Promise((r) => setTimeout(r, 500));
    expect(testTableApi).toBeTruthy();
    const initialStock = getCellValue(0, "stock");
    expect(initialStock).toBeTruthy();
    testTableApi?.updateData({ accessor: "stock", rowIndex: 0, newValue: 100 });
    await new Promise((r) => setTimeout(r, 200));
    const updatedStock = getCellValue(0, "stock");
    expect(updatedStock).toBe("100");
    expect(updatedStock).not.toBe(initialStock);
  },
};

export const UpdateDataAPISales = {
  render: () => renderLiveUpdatesTable(),
  play: async () => {
    await waitForTable();
    await new Promise((r) => setTimeout(r, 500));
    expect(testTableApi).toBeTruthy();
    const initialSales = getCellValue(0, "sales");
    expect(initialSales).toBeTruthy();
    testTableApi?.updateData({ accessor: "sales", rowIndex: 0, newValue: 500 });
    await new Promise((r) => setTimeout(r, 200));
    const updatedSales = getCellValue(0, "sales");
    expect(updatedSales).toBe("500");
    expect(updatedSales).not.toBe(initialSales);
  },
};

export const MultipleCellUpdates = {
  render: () => renderLiveUpdatesTable(),
  play: async () => {
    await waitForTable();
    await new Promise((r) => setTimeout(r, 500));
    expect(testTableApi).toBeTruthy();
    expect(getCellValue(0, "price")).toBeTruthy();
    expect(getCellValue(1, "price")).toBeTruthy();
    expect(getCellValue(2, "stock")).toBeTruthy();
    testTableApi?.updateData({ accessor: "price", rowIndex: 0, newValue: 11.11 });
    testTableApi?.updateData({ accessor: "price", rowIndex: 1, newValue: 22.22 });
    testTableApi?.updateData({ accessor: "stock", rowIndex: 2, newValue: 999 });
    await new Promise((r) => setTimeout(r, 200));
    expect(getCellValue(0, "price")).toBe("$11.11");
    expect(getCellValue(1, "price")).toBe("$22.22");
    expect(getCellValue(2, "stock")).toBe("999");
  },
};
