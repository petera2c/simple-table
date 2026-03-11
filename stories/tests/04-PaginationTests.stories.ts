/**
 * PAGINATION TESTS
 * Ported from React - same tests, vanilla table only.
 */

import { SimpleTableVanilla } from "../../dist/index.es.js";
import { expect, userEvent } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { renderVanillaTable, addParagraph, type RenderVanillaTableResult } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/04 - Pagination",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Comprehensive tests for pagination including basic pagination, server-side pagination, page navigation, and programmatic control.",
      },
    },
  },
};

export default meta;

// ============================================================================
// TEST DATA
// ============================================================================

const createPaginatedData = (count: number) => {
  const departments = ["Engineering", "Sales", "Marketing", "HR", "Finance"];
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    department: departments[index % departments.length],
    age: 20 + (index % 50),
  }));
};

// ============================================================================
// TEST UTILITIES
// ============================================================================

const getVisibleRowCount = (canvasElement: HTMLElement) => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return 0;
  const cells = bodyContainer.querySelectorAll(".st-cell[data-row-index]");
  const uniqueRowIndices = new Set(Array.from(cells).map((c) => c.getAttribute("data-row-index")));
  return uniqueRowIndices.size;
};

const getPaginationFooter = (canvasElement: HTMLElement) => canvasElement.querySelector(".st-footer");

const clickNextPageButton = async (canvasElement: HTMLElement) => {
  const footer = getPaginationFooter(canvasElement);
  if (!footer) throw new Error("Pagination footer not found");
  const nextButton = footer.querySelector<HTMLButtonElement>('button[aria-label="Go to next page"]');
  if (!nextButton) throw new Error("Next page button not found");
  if (nextButton.disabled) throw new Error("Next page button is disabled");
  const user = userEvent.setup();
  await user.click(nextButton);
  await new Promise((r) => setTimeout(r, 500));
};

const clickPreviousPageButton = async (canvasElement: HTMLElement) => {
  const footer = getPaginationFooter(canvasElement);
  if (!footer) throw new Error("Pagination footer not found");
  const prevButton = footer.querySelector<HTMLButtonElement>('button[aria-label="Go to previous page"]');
  if (!prevButton) throw new Error("Previous page button not found");
  if (prevButton.disabled) throw new Error("Previous page button is disabled");
  const user = userEvent.setup();
  await user.click(prevButton);
  await new Promise((r) => setTimeout(r, 500));
};

// ============================================================================
// TEST 1: BASIC PAGINATION
// ============================================================================

export const BasicPagination = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
      { accessor: "department", label: "Department", width: 150 },
    ];
    const data = createPaginatedData(50);
    const { wrapper, h2 } = renderVanillaTable(headers, data, { height: "400px", shouldPaginate: true });
    h2.textContent = "Basic Pagination";
    addParagraph(wrapper, "50 rows with default pagination (10 rows per page)");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const footer = getPaginationFooter(canvasElement);
    expect(footer).toBeTruthy();
    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
    expect(footer?.textContent).toBeTruthy();
  },
};

// ============================================================================
// TEST 2: CUSTOM ROWS PER PAGE
// ============================================================================

export const CustomRowsPerPage = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
    ];
    const data = createPaginatedData(50);
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      height: "400px",
      shouldPaginate: true,
      rowsPerPage: 20,
    });
    h2.textContent = "Custom Rows Per Page";
    addParagraph(wrapper, "50 rows with 20 rows per page");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(20);
    const footer = getPaginationFooter(canvasElement);
    expect(footer).toBeTruthy();
  },
};

// ============================================================================
// TEST 3: PAGE NAVIGATION
// ============================================================================

export const PageNavigation = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
    ];
    const data = createPaginatedData(50);
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      height: "400px",
      shouldPaginate: true,
      rowsPerPage: 10,
    });
    h2.textContent = "Page Navigation";
    addParagraph(wrapper, "Click Next/Previous buttons to navigate pages");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
    await clickNextPageButton(canvasElement);
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
    await clickNextPageButton(canvasElement);
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
    await clickPreviousPageButton(canvasElement);
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
  },
};

// ============================================================================
// TEST 4: ON PAGE CHANGE CALLBACK
// ============================================================================

export const OnPageChangeCallback = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "onPageChange Callback";
    wrapper.appendChild(h2);
    const stateDiv = document.createElement("div");
    stateDiv.style.padding = "1rem";
    stateDiv.style.backgroundColor = "#f0f0f0";
    stateDiv.style.borderRadius = "4px";
    stateDiv.style.marginBottom = "1rem";
    stateDiv.style.fontFamily = "monospace";
    const currentPageEl = document.createElement("div");
    currentPageEl.textContent = "Current Page: 1";
    const pageChangeCountEl = document.createElement("div");
    pageChangeCountEl.textContent = "Page Changes: 0";
    stateDiv.appendChild(currentPageEl);
    stateDiv.appendChild(pageChangeCountEl);
    wrapper.appendChild(stateDiv);
    let pageChangeCount = 0;
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createPaginatedData(50),
      height: "400px",
      shouldPaginate: true,
      rowsPerPage: 10,
      onPageChange: (page) => {
        currentPageEl.textContent = `Current Page: ${page}`;
        pageChangeCount += 1;
        pageChangeCountEl.textContent = `Page Changes: ${pageChangeCount}`;
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const callbackDisplay = canvasElement.querySelector("div[style*='monospace']");
    expect(callbackDisplay?.textContent).toContain("Current Page: 1");
    await clickNextPageButton(canvasElement);
    await new Promise((r) => setTimeout(r, 300));
    expect(callbackDisplay?.textContent).toContain("Page Changes:");
  },
};

// ============================================================================
// TEST 5: PROGRAMMATIC PAGE CONTROL
// ============================================================================

export const ProgrammaticPageControl = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "Programmatic Page Control";
    wrapper.appendChild(h2);
    const btnContainer = document.createElement("div");
    btnContainer.style.marginBottom = "1rem";
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "0.5rem";
    const goPage1Btn = document.createElement("button");
    goPage1Btn.textContent = "Go to Page 1";
    goPage1Btn.style.padding = "0.5rem 1rem";
    goPage1Btn.style.backgroundColor = "#2196F3";
    goPage1Btn.style.color = "white";
    goPage1Btn.style.border = "none";
    goPage1Btn.style.borderRadius = "4px";
    goPage1Btn.style.cursor = "pointer";
    const goPage3Btn = document.createElement("button");
    goPage3Btn.textContent = "Go to Page 3";
    goPage3Btn.style.padding = "0.5rem 1rem";
    goPage3Btn.style.backgroundColor = "#4CAF50";
    goPage3Btn.style.color = "white";
    goPage3Btn.style.border = "none";
    goPage3Btn.style.borderRadius = "4px";
    goPage3Btn.style.cursor = "pointer";
    const goLastBtn = document.createElement("button");
    goLastBtn.textContent = "Go to Last Page (5)";
    goLastBtn.style.padding = "0.5rem 1rem";
    goLastBtn.style.backgroundColor = "#FF9800";
    goLastBtn.style.color = "white";
    goLastBtn.style.border = "none";
    goLastBtn.style.borderRadius = "4px";
    goLastBtn.style.cursor = "pointer";
    btnContainer.appendChild(goPage1Btn);
    btnContainer.appendChild(goPage3Btn);
    btnContainer.appendChild(goLastBtn);
    wrapper.appendChild(btnContainer);
    const stateDiv = document.createElement("div");
    stateDiv.style.padding = "0.5rem";
    stateDiv.style.backgroundColor = "#f5f5f5";
    stateDiv.style.borderRadius = "4px";
    stateDiv.style.marginBottom = "1rem";
    stateDiv.style.fontFamily = "monospace";
    stateDiv.style.fontSize = "0.9rem";
    stateDiv.textContent = "Current Page: 1";
    wrapper.appendChild(stateDiv);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createPaginatedData(50),
      height: "400px",
      shouldPaginate: true,
      rowsPerPage: 10,
    });
    table.mount();
    (wrapper as RenderVanillaTableResult["wrapper"])._table = table;
    const updateState = () => {
      const page = table.getAPI().getCurrentPage();
      stateDiv.textContent = `Current Page: ${page}`;
    };
    goPage1Btn.onclick = async () => {
      await table.getAPI().setPage(1);
      updateState();
    };
    goPage3Btn.onclick = async () => {
      await table.getAPI().setPage(3);
      updateState();
    };
    goLastBtn.onclick = async () => {
      await table.getAPI().setPage(5);
      updateState();
    };
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
    const buttons = canvasElement.querySelectorAll("button");
    await user.click(buttons[1]);
    await new Promise((r) => setTimeout(r, 800));
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
    await user.click(buttons[2]);
    await new Promise((r) => setTimeout(r, 800));
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
    await user.click(buttons[0]);
    await new Promise((r) => setTimeout(r, 800));
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
  },
};

// ============================================================================
// TEST 6: SERVER-SIDE PAGINATION
// ============================================================================

export const ServerSidePagination = {
  render: () => {
    const totalRows = 100;
    const rowsPerPage = 10;
    let currentPageData = createPaginatedData(totalRows).slice(0, rowsPerPage);
    let currentPage = 1;
    let isLoading = false;
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "Server-Side Pagination";
    wrapper.appendChild(h2);
    addParagraph(wrapper, '100 total rows, fetching 10 rows per page from "server"');
    const stateDiv = document.createElement("div");
    stateDiv.style.padding = "0.5rem";
    stateDiv.style.backgroundColor = "#e3f2fd";
    stateDiv.style.borderRadius = "4px";
    stateDiv.style.marginBottom = "1rem";
    stateDiv.style.fontSize = "0.9rem";
    const updateStateDiv = () => {
      stateDiv.textContent = `Current Page: ${currentPage} | Loading: ${isLoading ? "Yes" : "No"}`;
    };
    updateStateDiv();
    wrapper.appendChild(stateDiv);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
      { accessor: "department", label: "Department", width: 150 },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: currentPageData,
      height: "400px",
      shouldPaginate: true,
      serverSidePagination: true,
      totalRowCount: totalRows,
      rowsPerPage,
      isLoading,
      onPageChange: async (page) => {
        isLoading = true;
        updateStateDiv();
        await new Promise((r) => setTimeout(r, 500));
        const allData = createPaginatedData(totalRows);
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        currentPageData = allData.slice(startIndex, endIndex);
        currentPage = page;
        isLoading = false;
        table.update({ rows: currentPageData, isLoading });
        updateStateDiv();
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
    await clickNextPageButton(canvasElement);
    await new Promise((r) => setTimeout(r, 1000));
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
  },
};

// ============================================================================
// TEST 7: PAGINATION WITH FILTERING
// ============================================================================

export const PaginationWithFiltering = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "Pagination with Filtering";
    wrapper.appendChild(h2);
    const btnContainer = document.createElement("div");
    btnContainer.style.marginBottom = "1rem";
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "0.5rem";
    const filterBtn = document.createElement("button");
    filterBtn.textContent = "Filter: Engineering Only";
    filterBtn.style.padding = "0.5rem 1rem";
    filterBtn.style.backgroundColor = "#2196F3";
    filterBtn.style.color = "white";
    filterBtn.style.border = "none";
    filterBtn.style.borderRadius = "4px";
    filterBtn.style.cursor = "pointer";
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear Filter";
    clearBtn.style.padding = "0.5rem 1rem";
    clearBtn.style.backgroundColor = "#f44336";
    clearBtn.style.color = "white";
    clearBtn.style.border = "none";
    clearBtn.style.borderRadius = "4px";
    clearBtn.style.cursor = "pointer";
    btnContainer.appendChild(filterBtn);
    btnContainer.appendChild(clearBtn);
    wrapper.appendChild(btnContainer);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, filterable: true },
      { accessor: "department", label: "Department", width: 150, filterable: true },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createPaginatedData(50),
      height: "400px",
      shouldPaginate: true,
      rowsPerPage: 10,
    });
    table.mount();
    (wrapper as RenderVanillaTableResult["wrapper"])._table = table;
    filterBtn.onclick = async () => {
      await table.getAPI().applyFilter({
        accessor: "department",
        operator: "equals",
        value: "Engineering",
      });
    };
    clearBtn.onclick = async () => {
      await table.getAPI().clearAllFilters();
    };
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
    const filterBtn = canvasElement.querySelector("button");
    await user.click(filterBtn);
    await new Promise((r) => setTimeout(r, 800));
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBeGreaterThan(0);
    expect(rowCount).toBeLessThanOrEqual(10);
    const buttons = canvasElement.querySelectorAll("button");
    await user.click(buttons[1]);
    await new Promise((r) => setTimeout(r, 800));
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
  },
};

// ============================================================================
// TEST 8: PAGINATION WITH SORTING
// ============================================================================

export const PaginationWithSorting = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number", isSortable: true },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, type: "number", isSortable: true },
      { accessor: "department", label: "Department", width: 150, isSortable: true },
    ];
    const data = createPaginatedData(50);
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      height: "400px",
      shouldPaginate: true,
      rowsPerPage: 10,
    });
    h2.textContent = "Pagination with Sorting";
    addParagraph(wrapper, "Sort columns and navigate pages - sorting persists across pages");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
    await clickNextPageButton(canvasElement);
    await new Promise((r) => setTimeout(r, 300));
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
    const footer = getPaginationFooter(canvasElement);
    expect(footer).toBeTruthy();
  },
};

// ============================================================================
// TEST 9: PAGINATION WITHOUT HEIGHT
// ============================================================================

export const PaginationWithoutHeight = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
    ];
    const data = createPaginatedData(50);
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      shouldPaginate: true,
      rowsPerPage: 10,
    });
    h2.textContent = "Pagination Without Height";
    addParagraph(wrapper, "Table adjusts to show all rows on current page (no internal scrolling)");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
    const footer = getPaginationFooter(canvasElement);
    expect(footer).toBeTruthy();
    const tableRoot = canvasElement.querySelector(".simple-table-root");
    expect(tableRoot).toBeTruthy();
  },
};
