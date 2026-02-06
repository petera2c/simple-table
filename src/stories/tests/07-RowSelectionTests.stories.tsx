import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect, userEvent, fireEvent } from "@storybook/test";
import { SimpleTable } from "../..";
import { HeaderObject } from "../..";

// ============================================================================
// DATA INTERFACES
// ============================================================================

interface Employee extends Record<string, any> {
  id: number;
  name: string;
  department: string;
  salary: number;
}

// ============================================================================
// TEST DATA
// ============================================================================

const createEmployeeData = (): Employee[] => {
  return [
    { id: 1, name: "Alice Johnson", department: "Engineering", salary: 120000 },
    { id: 2, name: "Bob Smith", department: "Design", salary: 95000 },
    { id: 3, name: "Charlie Brown", department: "Engineering", salary: 140000 },
    { id: 4, name: "Diana Prince", department: "Marketing", salary: 110000 },
    { id: 5, name: "Eve Adams", department: "Sales", salary: 105000 },
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

const getRow = (canvasElement: HTMLElement, rowIndex: number): HTMLElement | null => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return null;

  const rows = bodyContainer.querySelectorAll(".st-row");
  return rows[rowIndex] as HTMLElement;
};

const getSelectionCell = (canvasElement: HTMLElement, rowIndex: number): HTMLElement | null => {
  const row = getRow(canvasElement, rowIndex);
  if (!row) return null;

  return row.querySelector(".st-selection-cell") as HTMLElement;
};

const getRowCheckbox = (canvasElement: HTMLElement, rowIndex: number): HTMLInputElement | null => {
  const row = getRow(canvasElement, rowIndex);
  if (!row) return null;

  return row.querySelector('input[type="checkbox"]') as HTMLInputElement;
};

// Note: We need to click the actual input element, not the custom span
// The custom span is aria-hidden and the onChange is on the input

const getHeaderCheckbox = (canvasElement: HTMLElement): HTMLInputElement | null => {
  // Try multiple selectors to find the header checkbox
  // First try in .st-header
  let checkbox = canvasElement.querySelector(
    '.st-header input[type="checkbox"]'
  ) as HTMLInputElement;
  if (checkbox) return checkbox;

  // Try in .st-header-label
  checkbox = canvasElement.querySelector(
    '.st-header-label input[type="checkbox"]'
  ) as HTMLInputElement;
  if (checkbox) return checkbox;

  // Try anywhere in the table root
  checkbox = canvasElement.querySelector(
    '.simple-table-root input[type="checkbox"][aria-label*="Select all"]'
  ) as HTMLInputElement;
  return checkbox;
};

// Removed getHeaderCheckboxCustom - we should click the input directly

const getSelectedRowCount = async (canvasElement: HTMLElement): Promise<number> => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return 0;

  // Selected rows should show checkboxes even without hover
  // We need to hover over each row to reveal its checkbox and check if it's selected
  const rows = bodyContainer.querySelectorAll(".st-row");
  let count = 0;

  for (let i = 0; i < rows.length; i++) {
    const selectionCell = rows[i].querySelector(".st-selection-cell") as HTMLElement;
    if (selectionCell) {
      // Hover to reveal checkbox
      await userEvent.setup().hover(selectionCell);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const checkbox = rows[i].querySelector('input[type="checkbox"]') as HTMLInputElement;
      if (checkbox && checkbox.checked) {
        count++;
      }
    }
  }

  return count;
};

// ============================================================================
// STORYBOOK META
// ============================================================================

const meta: Meta = {
  title: "Tests/07 - Row Selection",
  parameters: {
    layout: "fullscreen",
    options: {
      showPanel: false,
    },
  },
  tags: ["test"],
};

export default meta;

// ============================================================================
// TEST 1: BASIC ROW SELECTION
// ============================================================================

export const BasicRowSelection: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];

    const data = createEmployeeData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Basic Row Selection</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Click checkboxes to select individual rows
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          enableRowSelection={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    // Verify no rows are selected initially
    expect(await getSelectedRowCount(canvasElement)).toBe(0);

    // Hover over first row's selection cell to show checkbox
    const firstSelectionCell = getSelectionCell(canvasElement, 0);
    if (!firstSelectionCell) throw new Error("First row selection cell not found");

    await user.hover(firstSelectionCell);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Get the checkbox
    const firstCheckbox = getRowCheckbox(canvasElement, 0);
    if (!firstCheckbox) throw new Error("First row checkbox not found");

    // Use fireEvent.click directly on the checkbox input
    // This triggers the onChange handler synchronously
    fireEvent.click(firstCheckbox);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Re-query the checkbox after click to get fresh state
    const updatedFirstCheckbox = getRowCheckbox(canvasElement, 0);

    // Verify first row is selected
    if (updatedFirstCheckbox) {
      expect(updatedFirstCheckbox.checked).toBe(true);
    }

    // Now check the count by hovering over all rows
    const selectedCount = await getSelectedRowCount(canvasElement);

    expect(selectedCount).toBe(1);

    // Hover over second row's selection cell to show checkbox
    const secondSelectionCell = getSelectionCell(canvasElement, 1);
    if (!secondSelectionCell) throw new Error("Second row selection cell not found");
    await user.hover(secondSelectionCell);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Select second row
    const secondCheckbox = getRowCheckbox(canvasElement, 1);
    if (!secondCheckbox) throw new Error("Second row checkbox not found");

    fireEvent.click(secondCheckbox);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Verify both rows are selected
    expect(await getSelectedRowCount(canvasElement)).toBe(2);

    // Hover back to first row's selection cell and deselect it
    await user.hover(firstSelectionCell);
    await new Promise((resolve) => setTimeout(resolve, 300));

    fireEvent.click(firstCheckbox);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Verify only second row is selected
    expect(await getSelectedRowCount(canvasElement)).toBe(1);
  },
};

// ============================================================================
// TEST 2: SELECT ALL FUNCTIONALITY
// ============================================================================

export const SelectAllFunctionality: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
    ];

    const data = createEmployeeData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Select All Functionality</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Use header checkbox to select/deselect all rows
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          enableRowSelection={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    // Get header checkbox
    const headerCheckbox = getHeaderCheckbox(canvasElement);
    if (!headerCheckbox) throw new Error("Header checkbox not found");

    // Verify initially unchecked
    expect(headerCheckbox.checked).toBe(false);
    expect(await getSelectedRowCount(canvasElement)).toBe(0);

    // Click header checkbox to select all
    fireEvent.click(headerCheckbox);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Re-query header checkbox after click
    const updatedHeaderCheckbox = getHeaderCheckbox(canvasElement);

    // Verify all rows are selected (5 rows)
    if (updatedHeaderCheckbox) {
      expect(updatedHeaderCheckbox.checked).toBe(true);
    }
    expect(await getSelectedRowCount(canvasElement)).toBe(5);

    // Click header checkbox again to deselect all
    const headerCheckboxForDeselect = getHeaderCheckbox(canvasElement);
    if (headerCheckboxForDeselect) {
      fireEvent.click(headerCheckboxForDeselect);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Re-query again
      const finalHeaderCheckbox = getHeaderCheckbox(canvasElement);

      // Verify all rows are deselected
      if (finalHeaderCheckbox) {
        expect(finalHeaderCheckbox.checked).toBe(false);
      }
      expect(await getSelectedRowCount(canvasElement)).toBe(0);
    }
  },
};

// ============================================================================
// TEST 3: PARTIAL SELECTION STATE
// ============================================================================

export const PartialSelectionState: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
    ];

    const data = createEmployeeData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Partial Selection State</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Header checkbox shows indeterminate state when some (but not all) rows are selected
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          enableRowSelection={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    const headerCheckbox = getHeaderCheckbox(canvasElement);
    if (!headerCheckbox) throw new Error("Header checkbox not found");

    // Hover and select first two rows
    const firstSelectionCell = getSelectionCell(canvasElement, 0);
    const secondSelectionCell = getSelectionCell(canvasElement, 1);
    if (!firstSelectionCell || !secondSelectionCell) throw new Error("Selection cells not found");

    await user.hover(firstSelectionCell);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const firstCheckbox = getRowCheckbox(canvasElement, 0);
    if (!firstCheckbox) throw new Error("First checkbox not found");
    fireEvent.click(firstCheckbox);
    await new Promise((resolve) => setTimeout(resolve, 300));

    await user.hover(secondSelectionCell);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const secondCheckbox = getRowCheckbox(canvasElement, 1);
    if (!secondCheckbox) throw new Error("Second checkbox not found");
    fireEvent.click(secondCheckbox);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Verify partial selection (2 out of 5 rows)
    expect(await getSelectedRowCount(canvasElement)).toBe(2);
  },
};

// ============================================================================
// TEST 4: ON ROW SELECTION CHANGE CALLBACK
// ============================================================================

export const OnRowSelectionChangeCallback: StoryObj = {
  render: () => {
    const [selectionInfo, setSelectionInfo] = React.useState<string>("No selection");
    const [selectedCount, setSelectedCount] = React.useState<number>(0);

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
    ];

    const data = createEmployeeData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>onRowSelectionChange Callback</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Callback is triggered when row selection changes
        </p>
        <div
          data-testid="selection-info"
          style={{
            marginBottom: "1rem",
            padding: "0.5rem",
            background: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          <div>Last action: {selectionInfo}</div>
          <div>Total selected: {selectedCount}</div>
        </div>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          enableRowSelection={true}
          onRowSelectionChange={({ row, isSelected, selectedRows }) => {
            const action = isSelected ? "Selected" : "Deselected";
            setSelectionInfo(`${action}: ${row.name}`);
            setSelectedCount(selectedRows.size);
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    const selectionInfo = canvasElement.querySelector('[data-testid="selection-info"]');
    if (!selectionInfo) throw new Error("Selection info not found");

    // Initial state
    expect(selectionInfo.textContent).toContain("No selection");
    expect(selectionInfo.textContent).toContain("Total selected: 0");

    // Hover and select first row
    const firstSelectionCell = getSelectionCell(canvasElement, 0);
    if (!firstSelectionCell) throw new Error("First row selection cell not found");
    await user.hover(firstSelectionCell);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const firstCheckbox = getRowCheckbox(canvasElement, 0);
    if (!firstCheckbox) throw new Error("First row checkbox not found");

    fireEvent.click(firstCheckbox);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Verify callback was triggered
    expect(selectionInfo.textContent).toContain("Selected: Alice Johnson");
    expect(selectionInfo.textContent).toContain("Total selected: 1");

    // Hover and deselect first row
    await user.hover(firstSelectionCell);
    await new Promise((resolve) => setTimeout(resolve, 300));
    fireEvent.click(firstCheckbox);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Verify deselection callback
    expect(selectionInfo.textContent).toContain("Deselected: Alice Johnson");
    expect(selectionInfo.textContent).toContain("Total selected: 0");
  },
};

// ============================================================================
// TEST 5: SELECTION WITH PAGINATION
// ============================================================================

export const SelectionWithPagination: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
    ];

    // Create more data for pagination
    const data = [
      ...createEmployeeData(),
      { id: 6, name: "Frank Miller", department: "Sales", salary: 98000 },
      { id: 7, name: "Grace Lee", department: "Engineering", salary: 115000 },
      { id: 8, name: "Henry Wilson", department: "Design", salary: 92000 },
    ];

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Selection with Pagination</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Selection state is maintained across pages
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          enableRowSelection={true}
          shouldPaginate={true}
          rowsPerPage={5}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    // Hover and select first two rows on page 1
    const firstSelectionCell = getSelectionCell(canvasElement, 0);
    const secondSelectionCell = getSelectionCell(canvasElement, 1);
    if (!firstSelectionCell || !secondSelectionCell) throw new Error("Selection cells not found");

    await user.hover(firstSelectionCell);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const firstCheckbox = getRowCheckbox(canvasElement, 0);
    if (!firstCheckbox) throw new Error("First checkbox not found");
    fireEvent.click(firstCheckbox);
    await new Promise((resolve) => setTimeout(resolve, 300));

    await user.hover(secondSelectionCell);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const secondCheckbox = getRowCheckbox(canvasElement, 1);
    if (!secondCheckbox) throw new Error("Second checkbox not found");
    fireEvent.click(secondCheckbox);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Verify 2 rows selected
    expect(await getSelectedRowCount(canvasElement)).toBe(2);

    // Navigate to page 2
    const nextButton = canvasElement.querySelector('button[aria-label="Go to next page"]');
    if (!nextButton) throw new Error("Next page button not found");

    await user.click(nextButton);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Hover and select first row on page 2
    const page2FirstSelectionCell = getSelectionCell(canvasElement, 0);
    if (!page2FirstSelectionCell) throw new Error("Page 2 first selection cell not found");
    await user.hover(page2FirstSelectionCell);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const page2FirstCheckbox = getRowCheckbox(canvasElement, 0);
    if (!page2FirstCheckbox) throw new Error("Page 2 first checkbox not found");

    fireEvent.click(page2FirstCheckbox);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Verify 1 row selected on this page
    expect(await getSelectedRowCount(canvasElement)).toBe(1);

    // Navigate back to page 1
    const prevButton = canvasElement.querySelector('button[aria-label="Go to previous page"]');
    if (!prevButton) throw new Error("Previous page button not found");

    await user.click(prevButton);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify the 2 rows are still selected on page 1
    expect(await getSelectedRowCount(canvasElement)).toBe(2);
  },
};

// ============================================================================
// TEST 6: SELECTION WITHOUT ENABLEROWSELECTION
// ============================================================================

export const NoSelectionWithoutProp: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
    ];

    const data = createEmployeeData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>No Selection Without enableRowSelection</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Checkboxes should not appear when enableRowSelection is false or not provided
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          enableRowSelection={false}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify no checkboxes exist
    const headerCheckbox = getHeaderCheckbox(canvasElement);
    expect(headerCheckbox).toBeNull();

    // Even after hovering, no checkbox should appear
    const firstRow = getRow(canvasElement, 0);
    if (firstRow) {
      await userEvent.setup().hover(firstRow);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const firstRowCheckbox = getRowCheckbox(canvasElement, 0);
    expect(firstRowCheckbox).toBeNull();
  },
};
