import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect } from "@storybook/test";
import { Row, SimpleTable } from "../..";
import { HeaderObject } from "../..";

// ============================================================================
// DATA INTERFACES
// ============================================================================

const createStoreData = (): Row[] => {
  return [
    {
      id: 1,
      storeName: "Downtown Store",
      city: "New York",
      squareFootage: 5000,
      openingDate: "2020-01-15",
      customerRating: 4.5,
      clothingSales: 125000,
      electronicsSales: 89000,
    },
    {
      id: 2,
      storeName: "Westside Mall",
      city: "Los Angeles",
      squareFootage: 7500,
      openingDate: "2019-06-20",
      customerRating: 4.2,
      clothingSales: 145000,
      electronicsSales: 112000,
    },
    {
      id: 3,
      storeName: "Central Plaza",
      city: "Chicago",
      squareFootage: 6200,
      openingDate: "2021-03-10",
      customerRating: 4.7,
      clothingSales: 98000,
      electronicsSales: 76000,
    },
  ];
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

const getVisibleColumnLabels = (canvasElement: HTMLElement): string[] => {
  const labels: string[] = [];
  const headers = canvasElement.querySelectorAll(".st-header-cell");

  headers.forEach((header) => {
    const label = header.querySelector(".st-header-label");
    if (label?.textContent) {
      labels.push(label.textContent.trim());
    }
  });

  return labels;
};

const openColumnEditor = async (canvasElement: HTMLElement) => {
  const columnEditorText = canvasElement.querySelector(".st-column-editor-text");
  expect(columnEditorText).toBeTruthy();

  (columnEditorText as HTMLElement).click();
  await new Promise((resolve) => setTimeout(resolve, 300));

  const popout =
    canvasElement.querySelector(".st-column-editor-popout.open") ||
    canvasElement.querySelector(".st-column-editor-popout");
  expect(popout).toBeTruthy();

  return popout;
};

const getColumnCheckboxItems = (popout: Element) => {
  const checkboxItems = popout.querySelectorAll(".st-header-checkbox-item");
  expect(checkboxItems.length).toBeGreaterThan(0);
  return Array.from(checkboxItems);
};

const getColumnLabelFromCheckbox = (checkboxItem: Element): string => {
  // The label text might be in a sibling element or as direct text content
  // Try multiple strategies to find the label text

  // Strategy 1: Look for a label element with text (not the checkbox label)
  const labelSpan = checkboxItem.querySelector(".st-checkbox-label-text");
  if (labelSpan?.textContent?.trim()) {
    return labelSpan.textContent.trim();
  }

  // Strategy 2: Get text content from the checkbox item itself, excluding the checkbox
  const itemText = checkboxItem.textContent?.trim() || "";
  if (itemText) {
    return itemText;
  }

  // Strategy 3: Look for any text node that's not inside the checkbox elements
  const walker = document.createTreeWalker(checkboxItem, NodeFilter.SHOW_TEXT, null);

  let textNode;
  while ((textNode = walker.nextNode())) {
    const text = textNode.textContent?.trim();
    if (text && text.length > 0) {
      return text;
    }
  }

  return "";
};

const getCheckboxInput = (checkboxItem: Element): HTMLInputElement => {
  const checkbox = checkboxItem.querySelector(".st-checkbox-input") as HTMLInputElement;
  expect(checkbox).toBeTruthy();
  return checkbox;
};

const toggleColumnVisibility = async (checkboxItem: Element): Promise<void> => {
  const checkbox = getCheckboxInput(checkboxItem);
  checkbox.click();
  await new Promise((resolve) => setTimeout(resolve, 300));
};

const isColumnVisible = (canvasElement: HTMLElement, columnLabel: string): boolean => {
  const headers = canvasElement.querySelectorAll(".st-header-cell");
  for (const header of Array.from(headers)) {
    const label = header.querySelector(".st-header-label");
    if (label?.textContent?.trim() === columnLabel) {
      return true;
    }
  }
  return false;
};

// ============================================================================
// STORYBOOK META
// ============================================================================

const meta: Meta<typeof SimpleTable> = {
  title: "Tests/15 - Column Visibility",
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
 * Test 1: Column Editor Structure
 * Tests that column editor panel exists and has correct structure
 */
export const ColumnEditorStructure: Story = {
  render: () => {
    const data = createStoreData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
      { accessor: "openingDate", label: "Opening Date", width: 150, type: "string" },
      { accessor: "customerRating", label: "Customer Rating", width: 150, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          editColumns={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Test column editor exists
    const columnEditor = canvasElement.querySelector(".st-column-editor");
    expect(columnEditor).toBeTruthy();

    // Test "Columns" text exists
    const columnEditorText = canvasElement.querySelector(".st-column-editor-text");
    expect(columnEditorText).toBeTruthy();
    expect(columnEditorText?.textContent?.trim()).toBe("Columns");

    // Open the panel
    const popout = await openColumnEditor(canvasElement);
    expect(popout).toBeTruthy();

    // Test popout structure
    const popoutContent = popout!.querySelector(".st-column-editor-popout-content");
    expect(popoutContent).toBeTruthy();

    // Test checkbox items
    const checkboxItems = getColumnCheckboxItems(popout!);
    expect(checkboxItems.length).toBe(6);

    // Test each checkbox item structure
    checkboxItems.forEach((item) => {
      const label = item.querySelector(".st-checkbox-label");
      expect(label).toBeTruthy();

      const checkbox = item.querySelector(".st-checkbox-input");
      expect(checkbox).toBeTruthy();

      const customCheckbox = item.querySelector(".st-checkbox-custom");
      expect(customCheckbox).toBeTruthy();
    });
  },
};

/**
 * Test 2: Hide Single Column
 * Tests hiding a single column via the column editor
 */
export const HideSingleColumn: Story = {
  render: () => {
    const data = createStoreData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          editColumns={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify all columns are initially visible
    const initialColumns = getVisibleColumnLabels(canvasElement);
    expect(initialColumns).toContain("City");

    // Open column editor
    const popout = await openColumnEditor(canvasElement);
    const checkboxItems = getColumnCheckboxItems(popout!);

    // Find and hide "City" column
    const cityItem = checkboxItems.find((item) => getColumnLabelFromCheckbox(item) === "City");
    expect(cityItem).toBeTruthy();

    const cityCheckbox = getCheckboxInput(cityItem!);
    expect(cityCheckbox.checked).toBe(true); // Checked means visible

    await toggleColumnVisibility(cityItem!);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify "City" column is now hidden
    expect(isColumnVisible(canvasElement, "City")).toBe(false);

    // Verify other columns are still visible
    expect(isColumnVisible(canvasElement, "ID")).toBe(true);
    expect(isColumnVisible(canvasElement, "Store Name")).toBe(true);
    expect(isColumnVisible(canvasElement, "Square Footage")).toBe(true);
  },
};

/**
 * Test 3: Hide Multiple Columns
 * Tests hiding multiple columns at once
 */
export const HideMultipleColumns: Story = {
  render: () => {
    const data = createStoreData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
      { accessor: "openingDate", label: "Opening Date", width: 150, type: "string" },
      { accessor: "customerRating", label: "Customer Rating", width: 150, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          editColumns={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Open column editor
    const popout = await openColumnEditor(canvasElement);
    const checkboxItems = getColumnCheckboxItems(popout!);

    // Hide multiple columns
    const columnsToHide = ["City", "Opening Date", "Customer Rating"];

    for (const columnLabel of columnsToHide) {
      const item = checkboxItems.find((i) => getColumnLabelFromCheckbox(i) === columnLabel);
      expect(item).toBeTruthy();
      await toggleColumnVisibility(item!);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Verify hidden columns are not visible
    for (const columnLabel of columnsToHide) {
      expect(isColumnVisible(canvasElement, columnLabel)).toBe(false);
    }

    // Verify remaining columns are still visible
    expect(isColumnVisible(canvasElement, "ID")).toBe(true);
    expect(isColumnVisible(canvasElement, "Store Name")).toBe(true);
    expect(isColumnVisible(canvasElement, "Square Footage")).toBe(true);
  },
};

/**
 * Test 4: Show Hidden Column
 * Tests showing a previously hidden column
 */
export const ShowHiddenColumn: Story = {
  render: () => {
    const data = createStoreData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string", hide: true },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          editColumns={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify "City" column is initially hidden
    expect(isColumnVisible(canvasElement, "City")).toBe(false);

    // Open column editor
    const popout = await openColumnEditor(canvasElement);
    const checkboxItems = getColumnCheckboxItems(popout!);

    // Find and show "City" column
    const cityItem = checkboxItems.find((item) => getColumnLabelFromCheckbox(item) === "City");
    expect(cityItem).toBeTruthy();

    const cityCheckbox = getCheckboxInput(cityItem!);
    expect(cityCheckbox.checked).toBe(false); // Unchecked means hidden

    await toggleColumnVisibility(cityItem!);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify "City" column is now visible
    expect(isColumnVisible(canvasElement, "City")).toBe(true);
  },
};

/**
 * Test 5: Toggle Column Visibility Multiple Times
 * Tests toggling a column's visibility on and off multiple times
 */
export const ToggleColumnMultipleTimes: Story = {
  render: () => {
    const data = createStoreData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          editColumns={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Initially visible
    expect(isColumnVisible(canvasElement, "City")).toBe(true);

    // Open column editor
    const popout = await openColumnEditor(canvasElement);
    const checkboxItems = getColumnCheckboxItems(popout!);
    const cityItem = checkboxItems.find((item) => getColumnLabelFromCheckbox(item) === "City");
    expect(cityItem).toBeTruthy();

    // Hide
    await toggleColumnVisibility(cityItem!);
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(isColumnVisible(canvasElement, "City")).toBe(false);

    // Show
    await toggleColumnVisibility(cityItem!);
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(isColumnVisible(canvasElement, "City")).toBe(true);

    // Hide again
    await toggleColumnVisibility(cityItem!);
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(isColumnVisible(canvasElement, "City")).toBe(false);

    // Show again
    await toggleColumnVisibility(cityItem!);
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(isColumnVisible(canvasElement, "City")).toBe(true);
  },
};

/**
 * Test 6: Column Count Changes
 * Tests that the visible column count changes when hiding/showing columns
 */
export const ColumnCountChanges: Story = {
  render: () => {
    const data = createStoreData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
      { accessor: "openingDate", label: "Opening Date", width: 150, type: "string" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          editColumns={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Check initial column count
    const initialColumns = getVisibleColumnLabels(canvasElement);
    expect(initialColumns.length).toBe(5);

    // Open column editor and hide 2 columns
    const popout = await openColumnEditor(canvasElement);
    const checkboxItems = getColumnCheckboxItems(popout!);

    const cityItem = checkboxItems.find((item) => getColumnLabelFromCheckbox(item) === "City");
    const dateItem = checkboxItems.find(
      (item) => getColumnLabelFromCheckbox(item) === "Opening Date",
    );

    await toggleColumnVisibility(cityItem!);
    await new Promise((resolve) => setTimeout(resolve, 300));
    await toggleColumnVisibility(dateItem!);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check column count after hiding
    const afterHideColumns = getVisibleColumnLabels(canvasElement);
    expect(afterHideColumns.length).toBe(3);

    // Show one column back
    await toggleColumnVisibility(cityItem!);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check column count after showing
    const afterShowColumns = getVisibleColumnLabels(canvasElement);
    expect(afterShowColumns.length).toBe(4);
  },
};
