/**
 * COLUMN FILTERING TESTS
 * Ported from React - same tests, vanilla table only.
 */

import { SimpleTableVanilla } from "../../dist/index.es.js";
import { expect, userEvent } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { renderVanillaTable, addParagraph, type RenderVanillaTableResult } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/03 - Column Filtering",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Comprehensive tests for column filtering including basic filtering, data type filters, external filtering, and programmatic control.",
      },
    },
  },
};

export default meta;

// ============================================================================
// TEST DATA
// ============================================================================

const createFilterableData = () => [
  { id: 1, name: "Alice Johnson", age: 28, salary: 75000, joinDate: "2024-01-10", isActive: true, status: "active", department: "Engineering" },
  { id: 2, name: "Bob Smith", age: 35, salary: 85000, joinDate: "2023-03-15", isActive: true, status: "active", department: "Sales" },
  { id: 3, name: "Charlie Brown", age: 42, salary: 95000, joinDate: "2022-11-20", isActive: false, status: "inactive", department: "Engineering" },
  { id: 4, name: "Diana Prince", age: 31, salary: 90000, joinDate: "2023-08-05", isActive: true, status: "pending", department: "Marketing" },
  { id: 5, name: "Eve Adams", age: 25, salary: 65000, joinDate: "2024-02-28", isActive: false, status: "active", department: "Engineering" },
  { id: 6, name: "Frank Miller", age: 38, salary: 82000, joinDate: "2023-05-12", isActive: true, status: "suspended", department: "Sales" },
  { id: 7, name: "Grace Lee", age: 29, salary: 78000, joinDate: "2023-12-01", isActive: false, status: "active", department: "Marketing" },
  { id: 8, name: "Henry Wilson", age: 45, salary: 105000, joinDate: "2022-07-18", isActive: true, status: "active", department: "Engineering" },
  { id: 9, name: "Ivy Chen", age: 33, salary: 88000, joinDate: "2023-09-22", isActive: true, status: "pending", department: "Sales" },
  { id: 10, name: "Jack Davis", age: 27, salary: 72000, joinDate: "2024-01-05", isActive: false, status: "inactive", department: "Marketing" },
];

// ============================================================================
// TEST UTILITIES
// ============================================================================

const findHeaderByLabel = (canvasElement: HTMLElement, label: string): Element | null => {
  const headers = canvasElement.querySelectorAll(".st-header-cell");
  for (const header of Array.from(headers)) {
    const labelText = header.querySelector(".st-header-label-text");
    if (labelText?.textContent?.trim() === label) return header;
  }
  return null;
};

const getVisibleRowCount = (canvasElement: HTMLElement) => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return 0;
  const cells = bodyContainer.querySelectorAll(".st-cell[data-row-index]");
  const uniqueRowIndices = new Set(Array.from(cells).map((c) => c.getAttribute("data-row-index")));
  return uniqueRowIndices.size;
};

const getColumnData = (canvasElement: HTMLElement, accessor: string) => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return [];
  const cells = bodyContainer.querySelectorAll(`[data-accessor="${accessor}"]`);
  return Array.from(cells)
    .map((cell) => {
      const content = cell.querySelector(".st-cell-content");
      return content?.textContent?.trim() || "";
    })
    .filter((text) => text.length > 0);
};

// ============================================================================
// TEST 1: BASIC FILTERABLE COLUMNS
// ============================================================================

export const BasicFilterableColumns = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, filterable: true },
      { accessor: "age", label: "Age", width: 100, type: "number", filterable: true },
      { accessor: "department", label: "Department", width: 150, filterable: true },
    ];
    const data = createFilterableData();
    const { wrapper, h2 } = renderVanillaTable(headers, data, { height: "400px" });
    h2.textContent = "Basic Filterable Columns";
    addParagraph(wrapper, "Name, Age, and Department columns have filter icons");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();

    const nameHeader = findHeaderByLabel(canvasElement, "Name");
    expect(nameHeader).toBeTruthy();
    expect(nameHeader?.querySelector(".st-icon-container")).toBeTruthy();

    const ageHeader = findHeaderByLabel(canvasElement, "Age");
    expect(ageHeader).toBeTruthy();
    expect(ageHeader?.querySelector(".st-icon-container")).toBeTruthy();

    const idHeader = findHeaderByLabel(canvasElement, "ID");
    expect(idHeader).toBeTruthy();
    expect(idHeader?.querySelector(".st-icon-container")).toBeFalsy();

    const initialRowCount = getVisibleRowCount(canvasElement);
    expect(initialRowCount).toBe(10);
  },
};

// ============================================================================
// TEST 2: PROGRAMMATIC FILTER CONTROL - APPLY FILTER
// ============================================================================

export const ProgrammaticApplyFilter = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "Programmatic Filter Control";
    wrapper.appendChild(h2);
    const btnContainer = document.createElement("div");
    btnContainer.style.marginBottom = "1rem";
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "0.5rem";
    const filterNameBtn = document.createElement("button");
    filterNameBtn.textContent = 'Filter Name Contains "Johnson"';
    filterNameBtn.style.padding = "0.5rem 1rem";
    filterNameBtn.style.backgroundColor = "#2196F3";
    filterNameBtn.style.color = "white";
    filterNameBtn.style.border = "none";
    filterNameBtn.style.borderRadius = "4px";
    filterNameBtn.style.cursor = "pointer";
    const filterAgeBtn = document.createElement("button");
    filterAgeBtn.textContent = "Filter Age > 30";
    filterAgeBtn.style.padding = "0.5rem 1rem";
    filterAgeBtn.style.backgroundColor = "#4CAF50";
    filterAgeBtn.style.color = "white";
    filterAgeBtn.style.border = "none";
    filterAgeBtn.style.borderRadius = "4px";
    filterAgeBtn.style.cursor = "pointer";
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear All Filters";
    clearBtn.style.padding = "0.5rem 1rem";
    clearBtn.style.backgroundColor = "#f44336";
    clearBtn.style.color = "white";
    clearBtn.style.border = "none";
    clearBtn.style.borderRadius = "4px";
    clearBtn.style.cursor = "pointer";
    btnContainer.appendChild(filterNameBtn);
    btnContainer.appendChild(filterAgeBtn);
    btnContainer.appendChild(clearBtn);
    wrapper.appendChild(btnContainer);
    const filterStatusDiv = document.createElement("div");
    filterStatusDiv.style.padding = "0.5rem";
    filterStatusDiv.style.backgroundColor = "#f5f5f5";
    filterStatusDiv.style.borderRadius = "4px";
    filterStatusDiv.style.marginBottom = "1rem";
    filterStatusDiv.style.fontFamily = "monospace";
    filterStatusDiv.style.fontSize = "0.9rem";
    filterStatusDiv.textContent = "Filter Status: No filters";
    wrapper.appendChild(filterStatusDiv);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, filterable: true },
      { accessor: "age", label: "Age", width: 100, type: "number", filterable: true },
      { accessor: "department", label: "Department", width: 150, filterable: true },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createFilterableData(),
      height: "400px",
    });
    table.mount();
    (wrapper as RenderVanillaTableResult["wrapper"])._table = table;
    const updateFilterInfo = () => {
      const filters = table.getAPI().getFilterState();
      const count = Object.keys(filters).length;
      filterStatusDiv.textContent = count > 0 ? `${count} filter(s) active` : "No filters";
    };
    filterNameBtn.onclick = async () => {
      await table.getAPI().applyFilter({ accessor: "name", operator: "contains", value: "Johnson" });
      updateFilterInfo();
    };
    filterAgeBtn.onclick = async () => {
      await table.getAPI().applyFilter({ accessor: "age", operator: "greaterThan", value: 30 });
      updateFilterInfo();
    };
    clearBtn.onclick = async () => {
      await table.getAPI().clearAllFilters();
      updateFilterInfo();
    };
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);

    const filterNameBtn = canvasElement.querySelector("button");
    if (!filterNameBtn) throw new Error("Filter Name button not found");
    await user.click(filterNameBtn);
    await new Promise((r) => setTimeout(r, 800));

    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(1);
    const nameData = getColumnData(canvasElement, "name");
    expect(nameData[0]).toContain("Johnson");

    const buttons = canvasElement.querySelectorAll("button");
    await user.click(buttons[2]);
    await new Promise((r) => setTimeout(r, 800));

    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);

    await user.click(buttons[1]);
    await new Promise((r) => setTimeout(r, 800));

    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBeGreaterThan(0);
    expect(rowCount).toBeLessThan(10);
    const ageData = getColumnData(canvasElement, "age");
    ageData.forEach((age) => {
      expect(parseInt(age)).toBeGreaterThan(30);
    });
  },
};

// ============================================================================
// TEST 3: PROGRAMMATIC CLEAR SPECIFIC FILTER
// ============================================================================

export const ProgrammaticClearFilter = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "Clear Specific Filter";
    wrapper.appendChild(h2);
    const btnContainer = document.createElement("div");
    btnContainer.style.marginBottom = "1rem";
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "0.5rem";
    const applyBtn = document.createElement("button");
    applyBtn.textContent = "Apply Multiple Filters";
    applyBtn.style.padding = "0.5rem 1rem";
    applyBtn.style.backgroundColor = "#2196F3";
    applyBtn.style.color = "white";
    applyBtn.style.border = "none";
    applyBtn.style.borderRadius = "4px";
    applyBtn.style.cursor = "pointer";
    const clearDeptBtn = document.createElement("button");
    clearDeptBtn.textContent = "Clear Department Filter";
    clearDeptBtn.style.padding = "0.5rem 1rem";
    clearDeptBtn.style.backgroundColor = "#FF9800";
    clearDeptBtn.style.color = "white";
    clearDeptBtn.style.border = "none";
    clearDeptBtn.style.borderRadius = "4px";
    clearDeptBtn.style.cursor = "pointer";
    btnContainer.appendChild(applyBtn);
    btnContainer.appendChild(clearDeptBtn);
    wrapper.appendChild(btnContainer);
    const filterStatusDiv = document.createElement("div");
    filterStatusDiv.style.padding = "0.5rem";
    filterStatusDiv.style.backgroundColor = "#f5f5f5";
    filterStatusDiv.style.borderRadius = "4px";
    filterStatusDiv.style.marginBottom = "1rem";
    filterStatusDiv.style.fontFamily = "monospace";
    filterStatusDiv.style.fontSize = "0.9rem";
    filterStatusDiv.textContent = "Filter Status: No filters";
    wrapper.appendChild(filterStatusDiv);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, filterable: true },
      { accessor: "age", label: "Age", width: 100, type: "number", filterable: true },
      { accessor: "department", label: "Department", width: 150, filterable: true },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createFilterableData(),
      height: "400px",
    });
    table.mount();
    (wrapper as RenderVanillaTableResult["wrapper"])._table = table;
    const updateFilterInfo = () => {
      const filters = table.getAPI().getFilterState();
      const count = Object.keys(filters).length;
      filterStatusDiv.textContent = count > 0 ? `${count} filter(s) active` : "No filters";
    };
    applyBtn.onclick = async () => {
      await table.getAPI().applyFilter({ accessor: "department", operator: "equals", value: "Engineering" });
      await table.getAPI().applyFilter({ accessor: "isActive", operator: "equals", value: true });
      updateFilterInfo();
    };
    clearDeptBtn.onclick = async () => {
      await table.getAPI().clearFilter("department");
      updateFilterInfo();
    };
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);

    const applyBtn = canvasElement.querySelector("button");
    if (!applyBtn) throw new Error("Apply button not found");
    await user.click(applyBtn);
    await new Promise((r) => setTimeout(r, 1000));

    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBeLessThan(10);
    const rowCountWithBothFilters = rowCount;

    const buttons = canvasElement.querySelectorAll("button");
    await user.click(buttons[1]);
    await new Promise((r) => setTimeout(r, 800));

    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBeGreaterThan(rowCountWithBothFilters);
    expect(rowCount).toBeLessThan(10);
  },
};

// ============================================================================
// TEST 4: ON FILTER CHANGE CALLBACK
// ============================================================================

export const OnFilterChangeCallback = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "onFilterChange Callback";
    wrapper.appendChild(h2);
    const callbackDiv = document.createElement("div");
    callbackDiv.style.padding = "1rem";
    callbackDiv.style.backgroundColor = "#f0f0f0";
    callbackDiv.style.borderRadius = "4px";
    callbackDiv.style.marginBottom = "1rem";
    callbackDiv.style.fontFamily = "monospace";
    const line1 = document.createElement("div");
    line1.textContent = "Active Filters: 0";
    const line2 = document.createElement("div");
    line2.textContent = "Last Filter: None";
    callbackDiv.appendChild(line1);
    callbackDiv.appendChild(line2);
    wrapper.appendChild(callbackDiv);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, filterable: true },
      { accessor: "age", label: "Age", width: 100, type: "number", filterable: true },
      { accessor: "department", label: "Department", width: 150, filterable: true },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createFilterableData(),
      height: "400px",
      onFilterChange: (filters) => {
        const count = Object.keys(filters).length;
        line1.textContent = `Active Filters: ${count}`;
        if (count > 0) {
          const filterValues = Object.values(filters) as { accessor: string; operator: string; value: unknown }[];
          const lastFilterObj = filterValues[filterValues.length - 1];
          line2.textContent = `Last Filter: ${lastFilterObj.accessor} ${lastFilterObj.operator} ${lastFilterObj.value}`;
        } else {
          line2.textContent = "Last Filter: None";
        }
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const callbackDisplay = canvasElement.querySelector("div[style*='monospace']");
    expect(callbackDisplay).toBeTruthy();
    expect(callbackDisplay?.textContent).toContain("Active Filters: 0");
  },
};

// ============================================================================
// TEST 5: EXTERNAL FILTER HANDLING
// ============================================================================

export const ExternalFilterHandling = {
  render: () => {
    let filteredData = createFilterableData();
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "External Filter Handling";
    wrapper.appendChild(h2);
    addParagraph(wrapper, "Filtering handled externally - table displays pre-filtered data");
    const stateDiv = document.createElement("div");
    stateDiv.style.padding = "0.5rem";
    stateDiv.style.backgroundColor = "#e3f2fd";
    stateDiv.style.borderRadius = "4px";
    stateDiv.style.marginBottom = "1rem";
    stateDiv.style.fontSize = "0.9rem";
    stateDiv.textContent = "Current Filter: None";
    wrapper.appendChild(stateDiv);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, filterable: true },
      { accessor: "age", label: "Age", width: 100, type: "number", filterable: true },
      { accessor: "department", label: "Department", width: 150, filterable: true },
    ];
    let filterAppliedRef = false;
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: filteredData,
      height: "400px",
      externalFilterHandling: true,
      onFilterChange: (filters) => {
        if (filterAppliedRef) {
          filterAppliedRef = false;
          return;
        }
        const allData = createFilterableData();
        if (Object.keys(filters).length === 0) {
          filteredData = allData;
          stateDiv.textContent = "Current Filter: None";
          table.update({ rows: filteredData });
          return;
        }
        let filtered = allData;
        let filterDesc = "None";
        (Object.values(filters) as { accessor: string; operator: string; value: unknown }[]).forEach((filter) => {
          const { accessor, operator, value } = filter;
          if (operator === "contains") {
            filtered = filtered.filter((row) =>
              String(row[accessor]).toLowerCase().includes(String(value).toLowerCase())
            );
            filterDesc = `${accessor} contains "${value}"`;
          } else if (operator === "equals") {
            filtered = filtered.filter((row) => row[accessor] === value);
            filterDesc = `${accessor} equals "${value}"`;
          } else if (operator === "greaterThan") {
            filtered = filtered.filter((row) => Number(row[accessor]) > Number(value));
            filterDesc = `${accessor} > ${value}`;
          }
        });
        filterAppliedRef = true;
        filteredData = filtered;
        stateDiv.textContent = `Current Filter: ${filterDesc}`;
        table.update({ rows: filteredData });
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const initialRowCount = getVisibleRowCount(canvasElement);
    expect(initialRowCount).toBe(10);
  },
};

// ============================================================================
// TEST 6: FILTER WITH DIFFERENT DATA TYPES
// ============================================================================

export const FilterDifferentDataTypes = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number", filterable: true },
      { accessor: "name", label: "Name (String)", width: 200, type: "string", filterable: true },
      { accessor: "age", label: "Age (Number)", width: 120, type: "number", filterable: true },
      { accessor: "joinDate", label: "Join Date (Date)", width: 150, type: "date", filterable: true },
      { accessor: "isActive", label: "Active (Boolean)", width: 130, type: "boolean", filterable: true },
      { accessor: "status", label: "Status (Enum)", width: 130, type: "enum", filterable: true, enumOptions: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
        { label: "Suspended", value: "suspended" },
      ] },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createFilterableData(), { height: "400px" });
    h2.textContent = "Filter Different Data Types";
    addParagraph(wrapper, "All columns are filterable with type-specific operators");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerLabels = ["ID", "Name (String)", "Age (Number)", "Join Date (Date)", "Active (Boolean)", "Status (Enum)"];
    headerLabels.forEach((label) => {
      const header = findHeaderByLabel(canvasElement, label);
      expect(header).toBeTruthy();
      expect(header?.querySelector(".st-icon-container")).toBeTruthy();
    });
    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
  },
};

// ============================================================================
// TEST 7: GET FILTER STATE
// ============================================================================

export const GetFilterState = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "Get Filter State API";
    wrapper.appendChild(h2);
    const applyBtn = document.createElement("button");
    applyBtn.textContent = "Apply Filter & Show State";
    applyBtn.style.padding = "0.5rem 1rem";
    applyBtn.style.backgroundColor = "#2196F3";
    applyBtn.style.color = "white";
    applyBtn.style.border = "none";
    applyBtn.style.borderRadius = "4px";
    applyBtn.style.cursor = "pointer";
    applyBtn.style.marginBottom = "1rem";
    wrapper.appendChild(applyBtn);
    const preEl = document.createElement("pre");
    preEl.style.padding = "1rem";
    preEl.style.backgroundColor = "#f5f5f5";
    preEl.style.borderRadius = "4px";
    preEl.style.marginBottom = "1rem";
    preEl.style.fontSize = "0.85rem";
    preEl.style.overflow = "auto";
    preEl.style.maxHeight = "150px";
    preEl.textContent = "{}";
    wrapper.appendChild(preEl);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, filterable: true },
      { accessor: "age", label: "Age", width: 100, type: "number", filterable: true },
      { accessor: "department", label: "Department", width: 150, filterable: true },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createFilterableData(),
      height: "400px",
    });
    table.mount();
    (wrapper as RenderVanillaTableResult["wrapper"])._table = table;
    applyBtn.onclick = async () => {
      await table.getAPI().applyFilter({ accessor: "name", operator: "contains", value: "Smith" });
      const filters = table.getAPI().getFilterState();
      preEl.textContent = JSON.stringify(filters, null, 2);
    };
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    const button = canvasElement.querySelector("button");
    if (!button) throw new Error("Button not found");
    await user.click(button);
    await new Promise((r) => setTimeout(r, 800));

    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBeLessThan(10);

    const filterStateDisplay = canvasElement.querySelector("pre");
    expect(filterStateDisplay).toBeTruthy();
    expect(filterStateDisplay?.textContent).toContain("name");
    expect(filterStateDisplay?.textContent).toContain("Smith");
  },
};
