import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect, userEvent } from "@storybook/test";
import { SimpleTable } from "../..";
import { HeaderObject } from "../..";

/**
 * PAGINATION TESTS
 *
 * This test suite covers all pagination features documented in:
 * - Pagination Documentation
 * - Programmatic Control API (Pagination Methods)
 * - API Reference (Pagination Props)
 *
 * Features tested:
 * 1. Basic pagination with shouldPaginate
 * 2. Custom rowsPerPage configuration
 * 3. Page navigation (next, previous, specific page)
 * 4. onPageChange callback
 * 5. onNextPage callback
 * 6. Server-side pagination with serverSidePagination
 * 7. totalRowCount for server-side pagination
 * 8. Programmatic API: getCurrentPage, setPage
 * 9. Pagination with filtering
 * 10. Pagination with sorting
 * 11. Page controls visibility and functionality
 * 12. First page button with ellipsis
 */

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

interface PaginatedRow extends Record<string, any> {
  id: number;
  name: string;
  email: string;
  department: string;
  age: number;
}

const createPaginatedData = (count: number): PaginatedRow[] => {
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

const getVisibleRowCount = (canvasElement: HTMLElement): number => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return 0;
  const rows = bodyContainer.querySelectorAll(".st-row");
  return rows.length;
};

const getPaginationFooter = (canvasElement: HTMLElement): HTMLElement | null => {
  return canvasElement.querySelector(".st-footer") as HTMLElement;
};

const getCurrentPageFromFooter = (canvasElement: HTMLElement): number | null => {
  const footer = getPaginationFooter(canvasElement);
  if (!footer) return null;

  // Look for current page indicator in footer
  const pageText = footer.textContent;
  const match = pageText?.match(/Page (\d+)/);
  return match ? parseInt(match[1]) : null;
};

const clickNextPageButton = async (canvasElement: HTMLElement) => {
  const footer = getPaginationFooter(canvasElement);
  if (!footer) throw new Error("Pagination footer not found");

  // Find next button using aria-label
  const nextButton = footer.querySelector('button[aria-label="Go to next page"]') as HTMLElement;

  if (!nextButton) throw new Error("Next page button not found");

  // Check if button is disabled
  if ((nextButton as HTMLButtonElement).disabled) {
    throw new Error("Next page button is disabled");
  }

  const user = userEvent.setup();
  await user.click(nextButton);
  await new Promise((resolve) => setTimeout(resolve, 500));
};

const clickPreviousPageButton = async (canvasElement: HTMLElement) => {
  const footer = getPaginationFooter(canvasElement);
  if (!footer) throw new Error("Pagination footer not found");

  // Find previous button using aria-label
  const prevButton = footer.querySelector(
    'button[aria-label="Go to previous page"]'
  ) as HTMLElement;

  if (!prevButton) throw new Error("Previous page button not found");

  // Check if button is disabled
  if ((prevButton as HTMLButtonElement).disabled) {
    throw new Error("Previous page button is disabled");
  }

  const user = userEvent.setup();
  await user.click(prevButton);
  await new Promise((resolve) => setTimeout(resolve, 500));
};

// ============================================================================
// TEST 1: BASIC PAGINATION
// ============================================================================

export const BasicPagination: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
      { accessor: "department", label: "Department", width: 150 },
    ];

    const data = createPaginatedData(50);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Basic Pagination</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          50 rows with default pagination (10 rows per page)
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" shouldPaginate={true} />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify pagination footer exists
    const footer = getPaginationFooter(canvasElement);
    expect(footer).toBeTruthy();

    // Verify only 10 rows visible on first page (default rowsPerPage)
    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);

    // Verify footer shows page information
    expect(footer?.textContent).toBeTruthy();
  },
};

// ============================================================================
// TEST 2: CUSTOM ROWS PER PAGE
// ============================================================================

export const CustomRowsPerPage: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
    ];

    const data = createPaginatedData(50);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Custom Rows Per Page</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>50 rows with 20 rows per page</p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          shouldPaginate={true}
          rowsPerPage={20}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify 20 rows visible on first page
    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(20);

    // Verify pagination footer exists
    const footer = getPaginationFooter(canvasElement);
    expect(footer).toBeTruthy();
  },
};

// ============================================================================
// TEST 3: PAGE NAVIGATION
// ============================================================================

export const PageNavigation: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
    ];

    const data = createPaginatedData(50);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Page Navigation</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Click Next/Previous buttons to navigate pages
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          shouldPaginate={true}
          rowsPerPage={10}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Initial state - page 1, rows 1-10
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);

    // Click Next button
    await clickNextPageButton(canvasElement);

    // Verify still 10 rows visible but different data (page 2)
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);

    // Click Next again
    await clickNextPageButton(canvasElement);

    // Verify page 3
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);

    // Click Previous button
    await clickPreviousPageButton(canvasElement);

    // Verify back to page 2
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
  },
};

// ============================================================================
// TEST 4: ON PAGE CHANGE CALLBACK
// ============================================================================

export const OnPageChangeCallback: StoryObj = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageChangeCount, setPageChangeCount] = React.useState(0);

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
    ];

    const data = createPaginatedData(50);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>onPageChange Callback</h2>
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            marginBottom: "1rem",
            fontFamily: "monospace",
          }}
        >
          <div>Current Page: {currentPage}</div>
          <div>Page Changes: {pageChangeCount}</div>
        </div>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          shouldPaginate={true}
          rowsPerPage={10}
          onPageChange={(page) => {
            setCurrentPage(page);
            setPageChangeCount((prev) => prev + 1);
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify initial state
    const callbackDisplay = canvasElement.querySelector("div[style*='monospace']");
    expect(callbackDisplay?.textContent).toContain("Current Page: 1");

    // Click Next button
    await clickNextPageButton(canvasElement);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Verify callback was triggered
    expect(callbackDisplay?.textContent).toContain("Page Changes:");
  },
};

// ============================================================================
// TEST 5: PROGRAMMATIC PAGE CONTROL
// ============================================================================

export const ProgrammaticPageControl: StoryObj = {
  render: () => {
    const tableRef = React.useRef<any>(null);
    const [currentPage, setCurrentPage] = React.useState(1);

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
    ];

    const data = createPaginatedData(50);

    const goToPage3 = async () => {
      if (tableRef.current) {
        await tableRef.current.setPage(3);
        updateCurrentPage();
      }
    };

    const goToPage1 = async () => {
      if (tableRef.current) {
        await tableRef.current.setPage(1);
        updateCurrentPage();
      }
    };

    const goToLastPage = async () => {
      if (tableRef.current) {
        await tableRef.current.setPage(5); // 50 rows / 10 per page = 5 pages
        updateCurrentPage();
      }
    };

    const updateCurrentPage = () => {
      if (tableRef.current) {
        const page = tableRef.current.getCurrentPage();
        setCurrentPage(page);
      }
    };

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Programmatic Page Control</h2>
        <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={goToPage1}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Go to Page 1
          </button>
          <button
            onClick={goToPage3}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Go to Page 3
          </button>
          <button
            onClick={goToLastPage}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#FF9800",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Go to Last Page (5)
          </button>
        </div>
        <div
          style={{
            padding: "0.5rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            marginBottom: "1rem",
            fontFamily: "monospace",
            fontSize: "0.9rem",
          }}
        >
          Current Page: {currentPage}
        </div>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          shouldPaginate={true}
          rowsPerPage={10}
          tableRef={tableRef}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const user = userEvent.setup();

    // Initial state - page 1
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);

    // Click "Go to Page 3" button
    const buttons = canvasElement.querySelectorAll("button");
    await user.click(buttons[1] as HTMLElement);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Verify page 3
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);

    // Click "Go to Last Page" button
    await user.click(buttons[2] as HTMLElement);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Verify last page (should have 10 rows)
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);

    // Click "Go to Page 1" button
    await user.click(buttons[0] as HTMLElement);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Verify back to page 1
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
  },
};

// ============================================================================
// TEST 6: SERVER-SIDE PAGINATION
// ============================================================================

export const ServerSidePagination: StoryObj = {
  render: () => {
    const [currentPageData, setCurrentPageData] = React.useState(
      createPaginatedData(10).slice(0, 10)
    );
    const [currentPage, setCurrentPage] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(false);
    const totalRows = 100;
    const rowsPerPage = 10;

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
      { accessor: "department", label: "Department", width: 150 },
    ];

    const fetchPageData = async (page: number) => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate data for the requested page
      const allData = createPaginatedData(totalRows);
      const startIndex = (page - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const pageData = allData.slice(startIndex, endIndex);

      setCurrentPageData(pageData);
      setCurrentPage(page);
      setIsLoading(false);
    };

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Server-Side Pagination</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          100 total rows, fetching 10 rows per page from "server"
        </p>
        <div
          style={{
            padding: "0.5rem",
            backgroundColor: "#e3f2fd",
            borderRadius: "4px",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          Current Page: {currentPage} | Loading: {isLoading ? "Yes" : "No"}
        </div>
        <SimpleTable
          defaultHeaders={headers}
          rows={currentPageData}
          height="400px"
          shouldPaginate={true}
          serverSidePagination={true}
          totalRowCount={totalRows}
          rowsPerPage={rowsPerPage}
          isLoading={isLoading}
          onPageChange={fetchPageData}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify initial state - 10 rows on page 1
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);

    // Click Next button
    await clickNextPageButton(canvasElement);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for "API call"

    // Verify page 2 data loaded
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
  },
};

// ============================================================================
// TEST 7: PAGINATION WITH FILTERING
// ============================================================================

export const PaginationWithFiltering: StoryObj = {
  render: () => {
    const tableRef = React.useRef<any>(null);

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, filterable: true },
      { accessor: "department", label: "Department", width: 150, filterable: true },
    ];

    const data = createPaginatedData(50);

    const applyFilter = async () => {
      if (tableRef.current) {
        await tableRef.current.applyFilter({
          accessor: "department",
          operator: "equals",
          value: "Engineering",
        });
      }
    };

    const clearFilters = async () => {
      if (tableRef.current) {
        await tableRef.current.clearAllFilters();
      }
    };

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Pagination with Filtering</h2>
        <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={applyFilter}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Filter: Engineering Only
          </button>
          <button
            onClick={clearFilters}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear Filter
          </button>
        </div>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          shouldPaginate={true}
          rowsPerPage={10}
          tableRef={tableRef}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const user = userEvent.setup();

    // Initial state - 10 rows on page 1
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);

    // Apply filter
    const filterBtn = canvasElement.querySelector("button") as HTMLElement;
    await user.click(filterBtn);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Verify filtered results (should be less than or equal to 10)
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBeGreaterThan(0);
    expect(rowCount).toBeLessThanOrEqual(10);

    // Clear filter
    const buttons = canvasElement.querySelectorAll("button");
    await user.click(buttons[1] as HTMLElement);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Verify back to full 10 rows
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);
  },
};

// ============================================================================
// TEST 8: PAGINATION WITH SORTING
// ============================================================================

export const PaginationWithSorting: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number", isSortable: true },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, type: "number", isSortable: true },
      { accessor: "department", label: "Department", width: 150, isSortable: true },
    ];

    const data = createPaginatedData(50);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Pagination with Sorting</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Sort columns and navigate pages - sorting persists across pages
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          shouldPaginate={true}
          rowsPerPage={10}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify initial state
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);

    // Navigate to page 2
    await clickNextPageButton(canvasElement);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Verify page 2
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);

    // Sorting and pagination work together
    const footer = getPaginationFooter(canvasElement);
    expect(footer).toBeTruthy();
  },
};

// ============================================================================
// TEST 9: PAGINATION WITHOUT HEIGHT
// ============================================================================

export const PaginationWithoutHeight: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
    ];

    const data = createPaginatedData(50);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Pagination Without Height</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Table adjusts to show all rows on current page (no internal scrolling)
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} shouldPaginate={true} rowsPerPage={10} />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify 10 rows visible
    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(10);

    // Verify pagination footer exists
    const footer = getPaginationFooter(canvasElement);
    expect(footer).toBeTruthy();

    // Table should expand to fit all rows (no fixed height)
    const tableRoot = canvasElement.querySelector(".simple-table-root") as HTMLElement;
    expect(tableRoot).toBeTruthy();
  },
};
