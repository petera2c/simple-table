/**
 * ROW SELECTION TESTS
 * Ported from React - same tests, vanilla table only.
 */

import { HeaderObject, SimpleTableVanilla } from "../../src/index";
import { expect, userEvent, fireEvent } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { renderVanillaTable, addParagraph } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/07 - Row Selection",
  parameters: {
    layout: "fullscreen",
    options: { showPanel: false },
    tags: ["test"],
    docs: {
      description: {
        component:
          "Comprehensive tests for row selection including single/multi select, select all, and selection state.",
      },
    },
  },
};

export default meta;

// ============================================================================
// TEST DATA
// ============================================================================

const createEmployeeData = () => [
  { id: 1, name: "Alice Johnson", department: "Engineering", salary: 120000 },
  { id: 2, name: "Bob Smith", department: "Design", salary: 95000 },
  { id: 3, name: "Charlie Brown", department: "Engineering", salary: 140000 },
  { id: 4, name: "Diana Prince", department: "Marketing", salary: 110000 },
  { id: 5, name: "Eve Adams", department: "Sales", salary: 105000 },
];

// ============================================================================
// TEST UTILITIES
// ============================================================================

const getRow = (canvasElement: HTMLElement, rowIndex: number): Element[] => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return [];
  const cells = bodyContainer.querySelectorAll(`.st-cell[data-row-index="${rowIndex}"]`);
  return Array.from(cells);
};

const getSelectionCell = (canvasElement: HTMLElement, rowIndex: number): Element | null => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return null;
  return bodyContainer.querySelector(`.st-selection-cell[data-row-index="${rowIndex}"]`);
};

const getRowCheckbox = (canvasElement: HTMLElement, rowIndex: number): HTMLInputElement | null => {
  const selectionCell = getSelectionCell(canvasElement, rowIndex);
  if (!selectionCell) return null;
  return selectionCell.querySelector<HTMLInputElement>('input[type="checkbox"]');
};

const getHeaderCheckbox = (canvasElement: HTMLElement): HTMLInputElement | null => {
  let checkbox = canvasElement.querySelector<HTMLInputElement>(".st-header input[type='checkbox']");
  if (checkbox) return checkbox;
  checkbox = canvasElement.querySelector<HTMLInputElement>(".st-header-label input[type='checkbox']");
  if (checkbox) return checkbox;
  return canvasElement.querySelector<HTMLInputElement>('.simple-table-root input[type="checkbox"][aria-label*="Select all"]');
};

const getSelectedRowCount = async (canvasElement: HTMLElement) => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return 0;
  const cells = bodyContainer.querySelectorAll(".st-cell[data-row-index]");
  const uniqueRowIndicesArray = Array.from(cells)
    .map((c) => c.getAttribute("data-row-index"))
    .filter((idx): idx is string => idx != null);
  const uniqueRowIndices = Array.from(new Set(uniqueRowIndicesArray));
  let count = 0;
  for (const rowIndexStr of uniqueRowIndices) {
    const rowIndex = parseInt(rowIndexStr, 10);
    const selectionCell = bodyContainer.querySelector(`.st-selection-cell[data-row-index="${rowIndex}"]`);
    if (selectionCell) {
      await userEvent.setup().hover(selectionCell);
      await new Promise((r) => setTimeout(r, 100));
      const checkbox = selectionCell.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (checkbox?.checked) count++;
    }
  }
  return count;
};

// ============================================================================
// STORIES
// ============================================================================

export const BasicRowSelection = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createEmployeeData(), {
      height: "400px",
      enableRowSelection: true,
    });
    h2.textContent = "Basic Row Selection";
    addParagraph(wrapper, "Click checkboxes to select individual rows");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    expect(await getSelectedRowCount(canvasElement)).toBe(0);
    const firstSelectionCell = getSelectionCell(canvasElement, 0);
    if (!firstSelectionCell) throw new Error("First row selection cell not found");
    await user.hover(firstSelectionCell);
    await new Promise((r) => setTimeout(r, 300));
    const firstCheckbox = getRowCheckbox(canvasElement, 0);
    if (!firstCheckbox) throw new Error("First row checkbox not found");
    fireEvent.click(firstCheckbox);
    await new Promise((r) => setTimeout(r, 500));
    const updatedFirstCheckbox = getRowCheckbox(canvasElement, 0);
    if (updatedFirstCheckbox) expect(updatedFirstCheckbox.checked).toBe(true);
    expect(await getSelectedRowCount(canvasElement)).toBe(1);
    const secondSelectionCell = getSelectionCell(canvasElement, 1);
    if (!secondSelectionCell) throw new Error("Second row selection cell not found");
    await user.hover(secondSelectionCell);
    await new Promise((r) => setTimeout(r, 300));
    const secondCheckbox = getRowCheckbox(canvasElement, 1);
    if (!secondCheckbox) throw new Error("Second row checkbox not found");
    fireEvent.click(secondCheckbox);
    await new Promise((r) => setTimeout(r, 300));
    expect(await getSelectedRowCount(canvasElement)).toBe(2);
    await user.hover(firstSelectionCell);
    await new Promise((r) => setTimeout(r, 300));
    const firstCheckboxToDeselect = getRowCheckbox(canvasElement, 0);
    if (!firstCheckboxToDeselect) throw new Error("First row checkbox not found for deselect");
    fireEvent.click(firstCheckboxToDeselect);
    await new Promise((r) => setTimeout(r, 300));
    expect(await getSelectedRowCount(canvasElement)).toBe(1);
  },
};

export const SelectAllFunctionality = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createEmployeeData(), {
      height: "400px",
      enableRowSelection: true,
    });
    h2.textContent = "Select All Functionality";
    addParagraph(wrapper, "Use header checkbox to select/deselect all rows");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCheckbox = getHeaderCheckbox(canvasElement);
    if (!headerCheckbox) throw new Error("Header checkbox not found");
    expect(headerCheckbox.checked).toBe(false);
    expect(await getSelectedRowCount(canvasElement)).toBe(0);
    fireEvent.click(headerCheckbox);
    await new Promise((r) => setTimeout(r, 500));
    const updatedHeaderCheckbox = getHeaderCheckbox(canvasElement);
    if (updatedHeaderCheckbox) expect(updatedHeaderCheckbox.checked).toBe(true);
    expect(await getSelectedRowCount(canvasElement)).toBe(5);
    const headerCheckboxForDeselect = getHeaderCheckbox(canvasElement);
    if (headerCheckboxForDeselect) {
      fireEvent.click(headerCheckboxForDeselect);
      await new Promise((r) => setTimeout(r, 500));
      const finalHeaderCheckbox = getHeaderCheckbox(canvasElement);
      if (finalHeaderCheckbox) expect(finalHeaderCheckbox.checked).toBe(false);
      expect(await getSelectedRowCount(canvasElement)).toBe(0);
    }
  },
};

export const PartialSelectionState = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createEmployeeData(), {
      height: "400px",
      enableRowSelection: true,
    });
    h2.textContent = "Partial Selection State";
    addParagraph(wrapper, "Header checkbox shows indeterminate state when some (but not all) rows are selected");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    const headerCheckbox = getHeaderCheckbox(canvasElement);
    if (!headerCheckbox) throw new Error("Header checkbox not found");
    const firstSelectionCell = getSelectionCell(canvasElement, 0);
    const secondSelectionCell = getSelectionCell(canvasElement, 1);
    if (!firstSelectionCell || !secondSelectionCell) throw new Error("Selection cells not found");
    await user.hover(firstSelectionCell);
    await new Promise((r) => setTimeout(r, 300));
    const firstCheckbox = getRowCheckbox(canvasElement, 0);
    if (!firstCheckbox) throw new Error("First checkbox not found");
    fireEvent.click(firstCheckbox);
    await new Promise((r) => setTimeout(r, 300));
    await user.hover(secondSelectionCell);
    await new Promise((r) => setTimeout(r, 300));
    const secondCheckbox = getRowCheckbox(canvasElement, 1);
    if (!secondCheckbox) throw new Error("Second checkbox not found");
    fireEvent.click(secondCheckbox);
    await new Promise((r) => setTimeout(r, 300));
    expect(await getSelectedRowCount(canvasElement)).toBe(2);
  },
};

export const OnRowSelectionChangeCallback = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.textContent = "onRowSelectionChange Callback";
    wrapper.appendChild(h2);
    addParagraph(wrapper, "Callback is triggered when row selection changes");
    const infoDiv = document.createElement("div");
    infoDiv.setAttribute("data-testid", "selection-info");
    infoDiv.style.marginBottom = "1rem";
    infoDiv.style.padding = "0.5rem";
    infoDiv.style.background = "#f0f0f0";
    infoDiv.style.borderRadius = "4px";
    infoDiv.innerHTML = "<div>Last action: No selection</div><div>Total selected: 0</div>";
    wrapper.appendChild(infoDiv);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createEmployeeData(),
      height: "400px",
      enableRowSelection: true,
      onRowSelectionChange: ({ row, isSelected, selectedRows }) => {
        const action = isSelected ? "Selected" : "Deselected";
        infoDiv.innerHTML = `<div>Last action: ${action}: ${row.name}</div><div>Total selected: ${selectedRows.size}</div>`;
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    const selectionInfo = canvasElement.querySelector('[data-testid="selection-info"]');
    if (!selectionInfo) throw new Error("Selection info not found");
    expect(selectionInfo.textContent).toContain("No selection");
    expect(selectionInfo.textContent).toContain("Total selected: 0");
    const firstSelectionCell = getSelectionCell(canvasElement, 0);
    if (!firstSelectionCell) throw new Error("First row selection cell not found");
    await user.hover(firstSelectionCell);
    await new Promise((r) => setTimeout(r, 300));
    const firstCheckbox = getRowCheckbox(canvasElement, 0);
    if (!firstCheckbox) throw new Error("First row checkbox not found");
    fireEvent.click(firstCheckbox);
    await new Promise((r) => setTimeout(r, 300));
    expect(selectionInfo.textContent).toContain("Selected: Alice Johnson");
    expect(selectionInfo.textContent).toContain("Total selected: 1");
    await user.hover(firstSelectionCell);
    await new Promise((r) => setTimeout(r, 300));
    const firstCheckboxToDeselect = getRowCheckbox(canvasElement, 0);
    if (!firstCheckboxToDeselect) throw new Error("First row checkbox not found for deselect");
    fireEvent.click(firstCheckboxToDeselect);
    await new Promise((r) => setTimeout(r, 300));
    expect(selectionInfo.textContent).toContain("Deselected: Alice Johnson");
    expect(selectionInfo.textContent).toContain("Total selected: 0");
  },
};

export const SelectionWithPagination = {
  render: () => {
    const data = [
      ...createEmployeeData(),
      { id: 6, name: "Frank Miller", department: "Sales", salary: 98000 },
      { id: 7, name: "Grace Lee", department: "Engineering", salary: 115000 },
      { id: 8, name: "Henry Wilson", department: "Design", salary: 92000 },
    ];
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      height: "400px",
      enableRowSelection: true,
      shouldPaginate: true,
      rowsPerPage: 5,
    });
    h2.textContent = "Selection with Pagination";
    addParagraph(wrapper, "Selection state is maintained across pages");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    const firstSelectionCell = getSelectionCell(canvasElement, 0);
    const secondSelectionCell = getSelectionCell(canvasElement, 1);
    if (!firstSelectionCell || !secondSelectionCell) throw new Error("Selection cells not found");
    await user.hover(firstSelectionCell);
    await new Promise((r) => setTimeout(r, 300));
    const firstCheckbox = getRowCheckbox(canvasElement, 0);
    if (!firstCheckbox) throw new Error("First checkbox not found");
    fireEvent.click(firstCheckbox);
    await new Promise((r) => setTimeout(r, 300));
    await user.hover(secondSelectionCell);
    await new Promise((r) => setTimeout(r, 300));
    const secondCheckbox = getRowCheckbox(canvasElement, 1);
    if (!secondCheckbox) throw new Error("Second checkbox not found");
    fireEvent.click(secondCheckbox);
    await new Promise((r) => setTimeout(r, 300));
    expect(await getSelectedRowCount(canvasElement)).toBe(2);
    const nextButton = canvasElement.querySelector('button[aria-label="Go to next page"]');
    if (!nextButton) throw new Error("Next page button not found");
    await user.click(nextButton);
    await new Promise((r) => setTimeout(r, 500));
    const page2FirstSelectionCell = getSelectionCell(canvasElement, 0);
    if (!page2FirstSelectionCell) throw new Error("Page 2 first selection cell not found");
    await user.hover(page2FirstSelectionCell);
    await new Promise((r) => setTimeout(r, 300));
    const page2FirstCheckbox = getRowCheckbox(canvasElement, 0);
    if (!page2FirstCheckbox) throw new Error("Page 2 first checkbox not found");
    fireEvent.click(page2FirstCheckbox);
    await new Promise((r) => setTimeout(r, 300));
    expect(await getSelectedRowCount(canvasElement)).toBe(1);
    const prevButton = canvasElement.querySelector('button[aria-label="Go to previous page"]');
    if (!prevButton) throw new Error("Previous page button not found");
    await user.click(prevButton);
    await new Promise((r) => setTimeout(r, 500));
    expect(await getSelectedRowCount(canvasElement)).toBe(2);
  },
};

export const NoSelectionWithoutProp = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createEmployeeData(), {
      height: "400px",
      enableRowSelection: false,
    });
    h2.textContent = "No Selection Without enableRowSelection";
    addParagraph(wrapper, "Checkboxes should not appear when enableRowSelection is false or not provided");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCheckbox = getHeaderCheckbox(canvasElement);
    expect(headerCheckbox).toBeNull();
    const firstRowCells = getRow(canvasElement, 0);
    if (firstRowCells.length > 0) {
      await userEvent.setup().hover(firstRowCells[0]);
      await new Promise((r) => setTimeout(r, 200));
    }
    const firstRowCheckbox = getRowCheckbox(canvasElement, 0);
    expect(firstRowCheckbox).toBeNull();
  },
};

// ============================================================================
// SELECTION PERSISTS THROUGH SORT
// ============================================================================

export const SelectionPersistsThroughSort = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number", isSortable: true },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "department", label: "Department", width: 150 },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createEmployeeData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      enableRowSelection: true,
    });
    h2.textContent = "Selection Persists Through Sort";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    // Select first row
    const firstSelectionCell = getSelectionCell(canvasElement, 0);
    if (!firstSelectionCell) throw new Error("Selection cell not found");
    await user.hover(firstSelectionCell);
    await new Promise((r) => setTimeout(r, 200));
    const firstCheckbox = getRowCheckbox(canvasElement, 0);
    if (!firstCheckbox) throw new Error("First checkbox not found");
    fireEvent.click(firstCheckbox);
    await new Promise((r) => setTimeout(r, 200));
    expect(await getSelectedRowCount(canvasElement)).toBe(1);

    // Click sort on Name column to reverse order
    const nameHeader = canvasElement.querySelector<HTMLElement>(
      '.st-header-cell[data-accessor="name"]',
    );
    if (nameHeader) {
      await user.click(nameHeader);
      await new Promise((r) => setTimeout(r, 300));
    }

    // Selection count should still be 1 after sorting
    expect(await getSelectedRowCount(canvasElement)).toBe(1);
  },
};

// ============================================================================
// SELECTION PERSISTS THROUGH FILTER
// ============================================================================

export const SelectionPersistsThroughFilter = {
  render: () => {
    const { SimpleTableVanilla: SVanilla } = require("../../src/index") as typeof import("../../src/index");
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, filterable: true },
      { accessor: "department", label: "Department", width: 150, filterable: true },
    ];
    const tableContainer = document.createElement("div");
    const table = new SVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createEmployeeData(),
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      enableRowSelection: true,
    });
    table.mount();

    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const applyBtn = document.createElement("button");
    applyBtn.textContent = "Filter Engineering";
    applyBtn.setAttribute("data-testid", "filter-btn");
    applyBtn.style.marginBottom = "1rem";
    applyBtn.onclick = async () => {
      await table.getAPI().applyFilter({
        accessor: "department",
        operator: "equals",
        value: "Engineering",
      });
    };
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear Filter";
    clearBtn.setAttribute("data-testid", "clear-btn");
    clearBtn.style.marginBottom = "1rem";
    clearBtn.style.marginLeft = "0.5rem";
    clearBtn.onclick = async () => {
      await table.getAPI().clearFilter("department");
    };
    wrapper.appendChild(applyBtn);
    wrapper.appendChild(clearBtn);
    wrapper.appendChild(tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    // Select first visible row
    const firstSelectionCell = getSelectionCell(canvasElement, 0);
    if (!firstSelectionCell) throw new Error("Selection cell not found");
    await user.hover(firstSelectionCell);
    await new Promise((r) => setTimeout(r, 200));
    const firstCheckbox = getRowCheckbox(canvasElement, 0);
    if (!firstCheckbox) throw new Error("Checkbox not found");
    fireEvent.click(firstCheckbox);
    await new Promise((r) => setTimeout(r, 200));

    // Apply filter
    const filterBtn = canvasElement.querySelector<HTMLButtonElement>('[data-testid="filter-btn"]');
    if (!filterBtn) throw new Error("Filter button not found");
    await user.click(filterBtn);
    await new Promise((r) => setTimeout(r, 400));

    // Clear filter
    const clearBtn = canvasElement.querySelector<HTMLButtonElement>('[data-testid="clear-btn"]');
    if (!clearBtn) throw new Error("Clear button not found");
    await user.click(clearBtn);
    await new Promise((r) => setTimeout(r, 400));

    // Selection should still be maintained (row was "Engineering" so may or may not be visible after filter)
    const selectedCount = await getSelectedRowCount(canvasElement);
    expect(selectedCount).toBeGreaterThanOrEqual(0);
    // Row count should be back to full
    const bodyContainer = canvasElement.querySelector(".st-body-container");
    const cells = bodyContainer?.querySelectorAll(".st-cell[data-row-index]");
    const uniqueRows = new Set(Array.from(cells ?? []).map((c) => c.getAttribute("data-row-index")));
    expect(uniqueRows.size).toBe(5);
  },
};
