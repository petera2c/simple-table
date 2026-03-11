/**
 * COLUMN SORTING TESTS
 * Ported from React - same tests, vanilla table only.
 */

import { SimpleTableVanilla } from "../../dist/index.es.js";
import { expect, userEvent } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { renderVanillaTable, addParagraph, type RenderVanillaTableResult } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/02 - Column Sorting",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Comprehensive tests for column sorting including basic sorting, custom sort orders, comparators, valueGetters, initial sort state, external sorting, and programmatic control.",
      },
    },
  },
};

export default meta;

// ============================================================================
// TEST DATA
// ============================================================================

const createSortableData = () => [
  { id: 1, name: "Charlie", age: 35, revenue: 50000, joinDate: "2023-03-15", isActive: true, priority: 2 },
  { id: 2, name: "Alice", age: 28, revenue: 75000, joinDate: "2024-01-10", isActive: false, priority: 1 },
  { id: 3, name: "Bob", age: 42, revenue: 60000, joinDate: "2022-11-20", isActive: true, priority: 3 },
  { id: 4, name: "Diana", age: 31, revenue: 90000, joinDate: "2023-08-05", isActive: true, priority: 1 },
  { id: 5, name: "Eve", age: 25, revenue: 45000, joinDate: "2024-02-28", isActive: false, priority: 2 },
  { id: 6, name: "Frank", age: 38, revenue: 82000, joinDate: "2023-05-12", isActive: true, priority: 3 },
  { id: 7, name: "Grace", age: 29, revenue: 68000, joinDate: "2023-12-01", isActive: false, priority: 2 },
  { id: 8, name: "Henry", age: 45, revenue: 95000, joinDate: "2022-07-18", isActive: true, priority: 1 },
];

const createNestedSortData = () => [
  { id: 1, user: { name: "Alice", profile: { score: 85, level: "Senior" } }, metadata: { seniorityLevel: 3, performance: 92 } },
  { id: 2, user: { name: "Bob", profile: { score: 72, level: "Mid" } }, metadata: { seniorityLevel: 2, performance: 78 } },
  { id: 3, user: { name: "Charlie", profile: { score: 95, level: "Lead" } }, metadata: { seniorityLevel: 4, performance: 88 } },
  { id: 4, user: { name: "Diana", profile: { score: 68, level: "Junior" } }, metadata: { seniorityLevel: 1, performance: 85 } },
  { id: 5, user: { name: "Eve", profile: { score: 91, level: "Senior" } }, metadata: { seniorityLevel: 3, performance: 95 } },
];

const createArraySortData = () => [
  { id: 1, name: "Artist A", awards: ["Grammy", "Emmy"], albums: [{ title: "Album Z", year: 2022, sales: 500000 }, { title: "Album Y", year: 2023, sales: 750000 }] },
  { id: 2, name: "Artist B", awards: ["Oscar", "Tony"], albums: [{ title: "Album A", year: 2021, sales: 300000 }, { title: "Album B", year: 2024, sales: 900000 }] },
  { id: 3, name: "Artist C", awards: ["Emmy", "Tony"], albums: [{ title: "Album M", year: 2020, sales: 450000 }, { title: "Album N", year: 2022, sales: 600000 }] },
  { id: 4, name: "Artist D", awards: ["Grammy", "Oscar"], albums: [{ title: "Album C", year: 2023, sales: 800000 }, { title: "Album D", year: 2024, sales: 1000000 }] },
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

const clickColumnHeader = async (canvasElement: HTMLElement, label: string) => {
  const header = findHeaderByLabel(canvasElement, label);
  if (!header) throw new Error(`Header with label "${label}" not found`);
  expect(header).toBeTruthy();
  const isSortable = header.classList.contains("clickable");
  if (!isSortable) throw new Error(`Header "${label}" is not sortable (missing clickable class)`);
  const headerLabel = header.querySelector(".st-header-label");
  if (!headerLabel) throw new Error(`Header label not found for "${label}"`);
  const user = userEvent.setup();
  await user.click(headerLabel);
  await new Promise((r) => setTimeout(r, 500));
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

const verifyAscendingOrder = (data: string[], dataType = "string") => {
  if (data.length < 2) return;
  for (let i = 0; i < data.length - 1; i++) {
    if (dataType === "number") {
      const current = parseFloat(data[i].replace(/[^0-9.-]/g, ""));
      const next = parseFloat(data[i + 1].replace(/[^0-9.-]/g, ""));
      if (!isNaN(current) && !isNaN(next) && current > next) {
        throw new Error(`Ascending order violated at index ${i}: ${current} > ${next}`);
      }
    } else {
      if (data[i].localeCompare(data[i + 1]) > 0) {
        throw new Error(`Ascending order violated at index ${i}: "${data[i]}" > "${data[i + 1]}"`);
      }
    }
  }
};

const verifyDescendingOrder = (data: string[], dataType = "string") => {
  if (data.length < 2) return;
  for (let i = 0; i < data.length - 1; i++) {
    if (dataType === "number") {
      const current = parseFloat(data[i].replace(/[^0-9.-]/g, ""));
      const next = parseFloat(data[i + 1].replace(/[^0-9.-]/g, ""));
      if (!isNaN(current) && !isNaN(next) && current < next) {
        throw new Error(`Descending order violated at index ${i}: ${current} < ${next}`);
      }
    } else {
      if (data[i].localeCompare(data[i + 1]) < 0) {
        throw new Error(`Descending order violated at index ${i}: "${data[i]}" < "${data[i + 1]}"`);
      }
    }
  }
};

const verifySortByData = async (canvasElement: HTMLElement, accessor: string, expectedDirection: string, dataType = "string") => {
  await new Promise((r) => setTimeout(r, 200));
  const data = getColumnData(canvasElement, accessor);
  if (data.length === 0) throw new Error(`No data found for accessor "${accessor}"`);
  if (expectedDirection === "asc") verifyAscendingOrder(data, dataType);
  else if (expectedDirection === "desc") verifyDescendingOrder(data, dataType);
};

// ============================================================================
// STORIES
// ============================================================================

export const BasicStringSorting = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
      { accessor: "revenue", label: "Revenue", width: 150, isSortable: true, type: "number" },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createSortableData(), { height: "400px" });
    h2.textContent = "Basic String Column Sorting";
    addParagraph(wrapper, 'Click "Name" header to cycle: unsorted → ascending → descending → unsorted');
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clickColumnHeader(canvasElement, "Name");
    await verifySortByData(canvasElement, "name", "asc", "string");
    await clickColumnHeader(canvasElement, "Name");
    await verifySortByData(canvasElement, "name", "desc", "string");
    await clickColumnHeader(canvasElement, "Name");
  },
};

export const BasicNumberSorting = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
      { accessor: "revenue", label: "Revenue", width: 150, isSortable: true, type: "number" },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createSortableData(), { height: "400px" });
    h2.textContent = "Basic Number Column Sorting";
    addParagraph(wrapper, 'Click "Age" header to sort numeric values');
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clickColumnHeader(canvasElement, "Age");
    await verifySortByData(canvasElement, "age", "asc", "number");
    await clickColumnHeader(canvasElement, "Age");
    await verifySortByData(canvasElement, "age", "desc", "number");
  },
};

export const CustomSortingOrderDescFirst = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "revenue", label: "Revenue", width: 150, isSortable: true, type: "number", sortingOrder: ["desc", "asc", null] },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createSortableData(), { height: "400px" });
    h2.textContent = "Custom Sort Order - Descending First";
    addParagraph(wrapper, "Revenue column cycles: descending → ascending → unsorted (common for numbers)");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clickColumnHeader(canvasElement, "Revenue");
    await verifySortByData(canvasElement, "revenue", "desc", "number");
    await clickColumnHeader(canvasElement, "Revenue");
    await verifySortByData(canvasElement, "revenue", "asc", "number");
    await clickColumnHeader(canvasElement, "Revenue");
  },
};

export const CustomSortingOrderAlwaysSorted = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "priority", label: "Priority", width: 150, isSortable: true, type: "number", sortingOrder: ["asc", "desc"] },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createSortableData(), { height: "400px" });
    h2.textContent = "Custom Sort Order - Always Sorted";
    addParagraph(wrapper, "Priority column toggles between ascending and descending (never unsorted)");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clickColumnHeader(canvasElement, "Priority");
    await verifySortByData(canvasElement, "priority", "asc", "number");
    await clickColumnHeader(canvasElement, "Priority");
    await verifySortByData(canvasElement, "priority", "desc", "number");
    await clickColumnHeader(canvasElement, "Priority");
    await verifySortByData(canvasElement, "priority", "asc", "number");
  },
};

export const DateSorting = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "joinDate", label: "Join Date", width: 150, isSortable: true, type: "date", sortingOrder: ["desc", "asc", null] },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createSortableData(), { height: "400px" });
    h2.textContent = "Date Column Sorting";
    addParagraph(wrapper, "Dates sorted with newest first (descending → ascending → unsorted)");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clickColumnHeader(canvasElement, "Join Date");
    await new Promise((r) => setTimeout(r, 100));
    const descData = getColumnData(canvasElement, "joinDate");
    for (let i = 0; i < descData.length - 1; i++) {
      const current = new Date(descData[i]).getTime();
      const next = new Date(descData[i + 1]).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
    await clickColumnHeader(canvasElement, "Join Date");
    await new Promise((r) => setTimeout(r, 100));
    const ascData = getColumnData(canvasElement, "joinDate");
    for (let i = 0; i < ascData.length - 1; i++) {
      const current = new Date(ascData[i]).getTime();
      const next = new Date(ascData[i + 1]).getTime();
      expect(current).toBeLessThanOrEqual(next);
    }
  },
};

export const NestedAccessorSorting = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "user.name", label: "Name", width: 150, isSortable: true },
      { accessor: "user.profile.score", label: "Score", width: 120, isSortable: true, type: "number" },
      { accessor: "user.profile.level", label: "Level", width: 120, isSortable: true },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createNestedSortData(), { height: "400px" });
    h2.textContent = "Nested Accessor Sorting";
    addParagraph(wrapper, "Sorting by nested properties: user.name, user.profile.score");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clickColumnHeader(canvasElement, "Name");
    await verifySortByData(canvasElement, "user.name", "asc", "string");
    await clickColumnHeader(canvasElement, "Score");
    await verifySortByData(canvasElement, "user.profile.score", "asc", "number");
  },
};

export const ArrayIndexAccessorSorting = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Artist", width: 150 },
      { accessor: "awards[0]", label: "First Award", width: 150, isSortable: true },
      { accessor: "albums[0].title", label: "First Album", width: 180, isSortable: true },
      { accessor: "albums[0].year", label: "Album Year", width: 120, isSortable: true, type: "number" },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createArraySortData(), { height: "400px" });
    h2.textContent = "Array Index Accessor Sorting (v1.9.4+)";
    addParagraph(wrapper, "Sorting by array elements: awards[0], albums[0].title, albums[0].year");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clickColumnHeader(canvasElement, "First Award");
    await verifySortByData(canvasElement, "awards[0]", "asc", "string");
    await clickColumnHeader(canvasElement, "First Album");
    await verifySortByData(canvasElement, "albums[0].title", "asc", "string");
  },
};

export const CustomComparatorMultiField = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      {
        accessor: "priority",
        label: "Priority + Revenue",
        width: 200,
        isSortable: true,
        comparator: ({ rowA, rowB, direction }) => {
          const priorityDiff = rowA.priority - rowB.priority;
          if (priorityDiff !== 0) return direction === "asc" ? priorityDiff : -priorityDiff;
          const revenueDiff = rowA.revenue - rowB.revenue;
          return direction === "asc" ? revenueDiff : -revenueDiff;
        },
      },
      { accessor: "revenue", label: "Revenue", width: 150, type: "number" },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createSortableData(), { height: "400px" });
    h2.textContent = "Custom Comparator - Multi-Field Sorting";
    addParagraph(wrapper, "Sorts by priority first, then by revenue as tiebreaker");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clickColumnHeader(canvasElement, "Priority + Revenue");
    await new Promise((r) => setTimeout(r, 100));
    const priorityData = getColumnData(canvasElement, "priority");
    expect(priorityData.length).toBeGreaterThan(0);
    verifyAscendingOrder(priorityData, "number");
  },
};

export const ValueGetterSorting = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "user.name", label: "Name", width: 150 },
      {
        accessor: "metadata.seniorityLevel",
        label: "Seniority",
        width: 150,
        isSortable: true,
        type: "number",
        valueGetter: ({ row }) => row.metadata?.seniorityLevel ?? 0,
        valueFormatter: ({ row }) => {
          const level = row.metadata?.seniorityLevel ?? 0;
          return ["Intern", "Junior", "Mid", "Senior", "Lead"][level] || "Unknown";
        },
      },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createNestedSortData(), { height: "400px" });
    h2.textContent = "ValueGetter for Sorting";
    addParagraph(wrapper, "Displays formatted text but sorts by numeric seniorityLevel");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clickColumnHeader(canvasElement, "Seniority");
    await new Promise((r) => setTimeout(r, 100));
    const seniorityData = getColumnData(canvasElement, "metadata.seniorityLevel");
    expect(seniorityData.length).toBeGreaterThan(0);
    expect(seniorityData[0]).toMatch(/Intern|Junior|Mid|Senior|Lead/);
  },
};

export const InitialSortState = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "revenue", label: "Revenue", width: 150, isSortable: true, type: "number" },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createSortableData(), {
      height: "400px",
      initialSortColumn: "revenue",
      initialSortDirection: "desc",
    });
    h2.textContent = "Initial Sort State";
    addParagraph(wrapper, "Table loads pre-sorted by Revenue (descending)");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await new Promise((r) => setTimeout(r, 500));
    await verifySortByData(canvasElement, "revenue", "desc", "number");
    const revenueHeader = findHeaderByLabel(canvasElement, "Revenue");
    if (revenueHeader) {
      const sortIconContainer = revenueHeader.querySelector(".st-icon-container");
      expect(sortIconContainer).toBeTruthy();
    }
  },
};

export const OnSortChangeCallback = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "onSortChange Callback";
    wrapper.appendChild(h2);
    const sortStateDiv = document.createElement("div");
    sortStateDiv.style.padding = "1rem";
    sortStateDiv.style.backgroundColor = "#f0f0f0";
    sortStateDiv.style.borderRadius = "4px";
    sortStateDiv.style.marginBottom = "1rem";
    sortStateDiv.style.fontFamily = "monospace";
    sortStateDiv.textContent = "Sort State: No sort applied";
    wrapper.appendChild(sortStateDiv);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createSortableData(),
      height: "400px",
      onSortChange: (sortConfig) => {
        sortStateDiv.textContent = sortConfig
          ? `Sort State: Sorting by ${sortConfig.key.accessor} (${sortConfig.direction})`
          : "Sort State: No sort applied";
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clickColumnHeader(canvasElement, "Name");
    await new Promise((r) => setTimeout(r, 300));
    const sortDisplay = canvasElement.querySelector("div[style*='monospace']");
    expect(sortDisplay?.textContent).toContain("Sorting by name");
  },
};

export const ExternalSortHandling = {
  render: () => {
    let sortedData = createSortableData();
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "External Sort Handling";
    wrapper.appendChild(h2);
    addParagraph(wrapper, "Sorting handled externally - table displays pre-sorted data");
    const stateDiv = document.createElement("div");
    stateDiv.style.padding = "0.5rem";
    stateDiv.style.backgroundColor = "#e3f2fd";
    stateDiv.style.borderRadius = "4px";
    stateDiv.style.marginBottom = "1rem";
    stateDiv.style.fontSize = "0.9rem";
    stateDiv.textContent = "Current Sort: None";
    wrapper.appendChild(stateDiv);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: sortedData,
      height: "400px",
      externalSortHandling: true,
      onSortChange: (sortConfig) => {
        if (sortConfig) {
          const { accessor } = sortConfig.key;
          const { direction } = sortConfig;
          sortedData = [...sortedData].sort((a, b) => {
            const aVal = a[accessor];
            const bVal = b[accessor];
            if (typeof aVal === "number" && typeof bVal === "number") {
              return direction === "asc" ? aVal - bVal : bVal - aVal;
            }
            const aStr = String(aVal);
            const bStr = String(bVal);
            return direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
          });
          stateDiv.textContent = `Current Sort: ${accessor} (${direction})`;
          table.update({ rows: sortedData });
        } else {
          sortedData = createSortableData();
          stateDiv.textContent = "Current Sort: None";
          table.update({ rows: sortedData });
        }
      },
    });
    table.mount();
    (wrapper as RenderVanillaTableResult["wrapper"])._table = table;
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clickColumnHeader(canvasElement, "Name");
    await new Promise((r) => setTimeout(r, 300));
    await verifySortByData(canvasElement, "name", "asc", "string");
  },
};

export const ProgrammaticSortControl = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "Programmatic Sort Control";
    wrapper.appendChild(h2);
    const btnContainer = document.createElement("div");
    btnContainer.style.marginBottom = "1rem";
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "0.5rem";
    const sortByNameBtn = document.createElement("button");
    sortByNameBtn.textContent = "Sort by Name (Asc)";
    sortByNameBtn.style.padding = "0.5rem 1rem";
    sortByNameBtn.style.backgroundColor = "#2196F3";
    sortByNameBtn.style.color = "white";
    sortByNameBtn.style.border = "none";
    sortByNameBtn.style.borderRadius = "4px";
    sortByNameBtn.style.cursor = "pointer";
    const sortByRevenueBtn = document.createElement("button");
    sortByRevenueBtn.textContent = "Sort by Revenue (Desc)";
    sortByRevenueBtn.style.padding = "0.5rem 1rem";
    sortByRevenueBtn.style.backgroundColor = "#4CAF50";
    sortByRevenueBtn.style.color = "white";
    sortByRevenueBtn.style.border = "none";
    sortByRevenueBtn.style.borderRadius = "4px";
    sortByRevenueBtn.style.cursor = "pointer";
    const clearSortBtn = document.createElement("button");
    clearSortBtn.textContent = "Clear Sort";
    clearSortBtn.style.padding = "0.5rem 1rem";
    clearSortBtn.style.backgroundColor = "#f44336";
    clearSortBtn.style.color = "white";
    clearSortBtn.style.border = "none";
    clearSortBtn.style.borderRadius = "4px";
    clearSortBtn.style.cursor = "pointer";
    const stateDiv = document.createElement("div");
    stateDiv.style.padding = "0.5rem";
    stateDiv.style.backgroundColor = "#f5f5f5";
    stateDiv.style.borderRadius = "4px";
    stateDiv.style.marginBottom = "1rem";
    stateDiv.style.fontFamily = "monospace";
    stateDiv.style.fontSize = "0.9rem";
    stateDiv.textContent = "Current Sort: No sort";
    wrapper.appendChild(btnContainer);
    btnContainer.appendChild(sortByNameBtn);
    btnContainer.appendChild(sortByRevenueBtn);
    btnContainer.appendChild(clearSortBtn);
    wrapper.appendChild(stateDiv);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
      { accessor: "revenue", label: "Revenue", width: 150, isSortable: true, type: "number" },
    ];
    const table = new SimpleTableVanilla(tableContainer, { defaultHeaders: headers, rows: createSortableData(), height: "400px" });
    table.mount();
    (wrapper as RenderVanillaTableResult["wrapper"])._table = table;
    const updateState = () => {
      const state = table.getAPI().getSortState();
      stateDiv.textContent = state ? `Current Sort: ${state.key.accessor} (${state.direction})` : "Current Sort: No sort";
    };
    sortByNameBtn.onclick = () => {
      table.getAPI().applySortState({ accessor: "name", direction: "asc" });
      updateState();
    };
    sortByRevenueBtn.onclick = () => {
      table.getAPI().applySortState({ accessor: "revenue", direction: "desc" });
      updateState();
    };
    clearSortBtn.onclick = () => {
      table.getAPI().applySortState(null);
      updateState();
    };
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    const sortByNameBtn = canvasElement.querySelector("button");
    if (!sortByNameBtn) throw new Error("Sort by Name button not found");
    await user.click(sortByNameBtn);
    await new Promise((r) => setTimeout(r, 800));
    await verifySortByData(canvasElement, "name", "asc", "string");
    const buttons = canvasElement.querySelectorAll("button");
    if (buttons.length < 2) throw new Error("Sort by Revenue button not found");
    await user.click(buttons[1]);
    await new Promise((r) => setTimeout(r, 800));
    await verifySortByData(canvasElement, "revenue", "desc", "number");
  },
};

export const MultipleColumnsSorting = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name (Asc First)", width: 180, isSortable: true, sortingOrder: ["asc", "desc", null] },
      { accessor: "revenue", label: "Revenue (Desc First)", width: 180, isSortable: true, type: "number", sortingOrder: ["desc", "asc", null] },
      { accessor: "priority", label: "Priority (Always)", width: 150, isSortable: true, type: "number", sortingOrder: ["asc", "desc"] },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createSortableData(), { height: "400px" });
    h2.textContent = "Multiple Columns with Different Sort Orders";
    addParagraph(wrapper, "Each column has its own custom sort cycle");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    await clickColumnHeader(canvasElement, "Name (Asc First)");
    await verifySortByData(canvasElement, "name", "asc", "string");
    await clickColumnHeader(canvasElement, "Revenue (Desc First)");
    await verifySortByData(canvasElement, "revenue", "desc", "number");
    await clickColumnHeader(canvasElement, "Priority (Always)");
    await verifySortByData(canvasElement, "priority", "asc", "number");
    await clickColumnHeader(canvasElement, "Priority (Always)");
    await verifySortByData(canvasElement, "priority", "desc", "number");
    await clickColumnHeader(canvasElement, "Priority (Always)");
    await verifySortByData(canvasElement, "priority", "asc", "number");
  },
};
