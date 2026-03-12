/**
 * COLUMN VISIBILITY TESTS
 * Ported from React - same tests, vanilla table only.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/15 - Column Visibility",
  parameters: { layout: "padded" },
};

export default meta;

const createStoreData = () => [
  { id: 1, storeName: "Downtown Store", city: "New York", squareFootage: 5000, openingDate: "2020-01-15", customerRating: 4.5, clothingSales: 125000, electronicsSales: 89000 },
  { id: 2, storeName: "Westside Mall", city: "Los Angeles", squareFootage: 7500, openingDate: "2019-06-20", customerRating: 4.2, clothingSales: 145000, electronicsSales: 112000 },
  { id: 3, storeName: "Central Plaza", city: "Chicago", squareFootage: 6200, openingDate: "2021-03-10", customerRating: 4.7, clothingSales: 98000, electronicsSales: 76000 },
];

const getVisibleColumnLabels = (canvasElement: HTMLElement): string[] => {
  const labels: string[] = [];
  canvasElement.querySelectorAll(".st-header-cell").forEach((header) => {
    const label = header.querySelector(".st-header-label");
    if (label?.textContent) labels.push(label.textContent.trim());
  });
  return labels;
};

const openColumnEditor = async (canvasElement: HTMLElement): Promise<Element> => {
  const columnEditorText = canvasElement.querySelector(".st-column-editor-text");
  expect(columnEditorText).toBeTruthy();
  (columnEditorText as HTMLElement).click();
  await new Promise((r) => setTimeout(r, 300));
  const popout = canvasElement.querySelector(".st-column-editor-popout.open") ?? canvasElement.querySelector(".st-column-editor-popout");
  expect(popout).toBeTruthy();
  return popout!;
};

const getColumnCheckboxItems = (popout: Element): Element[] => {
  const items = popout.querySelectorAll(".st-header-checkbox-item");
  expect(items.length).toBeGreaterThan(0);
  return Array.from(items);
};

const getColumnLabelFromCheckbox = (checkboxItem: Element): string => {
  const labelSpan = checkboxItem.querySelector(".st-checkbox-label-text");
  if (labelSpan?.textContent?.trim()) return labelSpan.textContent.trim();
  return checkboxItem.textContent?.trim() || "";
};

const getCheckboxInput = (checkboxItem: Element): HTMLInputElement => {
  const checkbox = checkboxItem.querySelector(".st-checkbox-input") as HTMLInputElement;
  expect(checkbox).toBeTruthy();
  return checkbox;
};

const toggleColumnVisibility = async (checkboxItem: Element): Promise<void> => {
  getCheckboxInput(checkboxItem).click();
  await new Promise((r) => setTimeout(r, 300));
};

const isColumnVisible = (canvasElement: HTMLElement, columnLabel: string): boolean => {
  const headers = canvasElement.querySelectorAll(".st-header-cell");
  for (const header of Array.from(headers)) {
    const label = header.querySelector(".st-header-label");
    if (label?.textContent?.trim() === columnLabel) return true;
  }
  return false;
};

export const ColumnEditorStructure = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
      { accessor: "openingDate", label: "Opening Date", width: 150, type: "string" },
      { accessor: "customerRating", label: "Customer Rating", width: 150, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (p) => String(p.row?.id), height: "400px", editColumns: true });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.querySelector(".st-column-editor")).toBeTruthy();
    const columnEditorText = canvasElement.querySelector(".st-column-editor-text");
    expect(columnEditorText?.textContent?.trim()).toBe("Columns");
    const popout = await openColumnEditor(canvasElement);
    expect(popout.querySelector(".st-column-editor-popout-content")).toBeTruthy();
    const items = getColumnCheckboxItems(popout);
    expect(items.length).toBe(6);
    items.forEach((item) => {
      expect(item.querySelector(".st-checkbox-label")).toBeTruthy();
      expect(item.querySelector(".st-checkbox-input")).toBeTruthy();
      expect(item.querySelector(".st-checkbox-custom")).toBeTruthy();
    });
  },
};

export const HideSingleColumn = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (p) => String(p.row?.id), height: "400px", editColumns: true });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(getVisibleColumnLabels(canvasElement)).toContain("City");
    const popout = await openColumnEditor(canvasElement);
    const items = getColumnCheckboxItems(popout);
    const cityItem = items.find((i) => getColumnLabelFromCheckbox(i) === "City");
    expect(cityItem).toBeTruthy();
    expect(getCheckboxInput(cityItem!).checked).toBe(true);
    await toggleColumnVisibility(cityItem!);
    await new Promise((r) => setTimeout(r, 500));
    expect(isColumnVisible(canvasElement, "City")).toBe(false);
    expect(isColumnVisible(canvasElement, "ID")).toBe(true);
    expect(isColumnVisible(canvasElement, "Store Name")).toBe(true);
    expect(isColumnVisible(canvasElement, "Square Footage")).toBe(true);
  },
};

export const HideMultipleColumns = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
      { accessor: "openingDate", label: "Opening Date", width: 150, type: "string" },
      { accessor: "customerRating", label: "Customer Rating", width: 150, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (p) => String(p.row?.id), height: "400px", editColumns: true });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await openColumnEditor(canvasElement);
    for (const label of ["City", "Opening Date", "Customer Rating"]) {
      const popout = canvasElement.querySelector(".st-column-editor-popout.open") ?? canvasElement.querySelector(".st-column-editor-popout");
      expect(popout).toBeTruthy();
      const items = getColumnCheckboxItems(popout!);
      const item = items.find((i) => getColumnLabelFromCheckbox(i) === label);
      expect(item).toBeTruthy();
      await toggleColumnVisibility(item!);
      await new Promise((r) => setTimeout(r, 300));
    }
    expect(isColumnVisible(canvasElement, "City")).toBe(false);
    expect(isColumnVisible(canvasElement, "Opening Date")).toBe(false);
    expect(isColumnVisible(canvasElement, "Customer Rating")).toBe(false);
    expect(isColumnVisible(canvasElement, "ID")).toBe(true);
    expect(isColumnVisible(canvasElement, "Store Name")).toBe(true);
    expect(isColumnVisible(canvasElement, "Square Footage")).toBe(true);
  },
};

export const ShowHiddenColumn = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string", hide: true },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (p) => String(p.row?.id), height: "400px", editColumns: true });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(isColumnVisible(canvasElement, "City")).toBe(false);
    const popout = await openColumnEditor(canvasElement);
    const items = getColumnCheckboxItems(popout);
    const cityItem = items.find((i) => getColumnLabelFromCheckbox(i) === "City");
    expect(cityItem).toBeTruthy();
    expect(getCheckboxInput(cityItem!).checked).toBe(false);
    await toggleColumnVisibility(cityItem!);
    await new Promise((r) => setTimeout(r, 500));
    expect(isColumnVisible(canvasElement, "City")).toBe(true);
  },
};

export const ToggleColumnMultipleTimes = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (p) => String(p.row?.id), height: "400px", editColumns: true });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(isColumnVisible(canvasElement, "City")).toBe(true);
    await openColumnEditor(canvasElement);
    for (let i = 0; i < 4; i++) {
      const popout = canvasElement.querySelector(".st-column-editor-popout.open") ?? canvasElement.querySelector(".st-column-editor-popout");
      expect(popout).toBeTruthy();
      const items = getColumnCheckboxItems(popout!);
      const cityItem = items.find((j) => getColumnLabelFromCheckbox(j) === "City");
      expect(cityItem).toBeTruthy();
      await toggleColumnVisibility(cityItem!);
      await new Promise((r) => setTimeout(r, 500));
    }
    expect(isColumnVisible(canvasElement, "City")).toBe(true);
  },
};

export const ColumnCountChanges = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
      { accessor: "openingDate", label: "Opening Date", width: 150, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (p) => String(p.row?.id), height: "400px", editColumns: true });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(getVisibleColumnLabels(canvasElement).length).toBe(5);
    await openColumnEditor(canvasElement);
    for (const label of ["City", "Opening Date"]) {
      const popout = canvasElement.querySelector(".st-column-editor-popout.open") ?? canvasElement.querySelector(".st-column-editor-popout");
      expect(popout).toBeTruthy();
      const items = getColumnCheckboxItems(popout!);
      const item = items.find((i) => getColumnLabelFromCheckbox(i) === label);
      expect(item).toBeTruthy();
      await toggleColumnVisibility(item!);
      await new Promise((r) => setTimeout(r, 300));
    }
    await new Promise((r) => setTimeout(r, 200));
    expect(getVisibleColumnLabels(canvasElement).length).toBe(3);
    const popout2 = canvasElement.querySelector(".st-column-editor-popout.open") ?? canvasElement.querySelector(".st-column-editor-popout");
    const items2 = getColumnCheckboxItems(popout2!);
    const cityItem2 = items2.find((i) => getColumnLabelFromCheckbox(i) === "City");
    expect(cityItem2).toBeTruthy();
    await toggleColumnVisibility(cityItem2!);
    await new Promise((r) => setTimeout(r, 500));
    expect(getVisibleColumnLabels(canvasElement).length).toBe(4);
  },
};
