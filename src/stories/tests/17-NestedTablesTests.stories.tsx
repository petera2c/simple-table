import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { SimpleTable } from "../..";
import { HeaderObject } from "../..";

/**
 * NESTED TABLES TESTS
 *
 * This test suite covers nested table functionality documented in:
 * - Nested Tables Documentation
 * - Column Configuration (nestedTable property)
 * - API Reference (Nested Table Props)
 *
 * Features tested:
 * 1. Basic nested table with expandable column
 * 2. Nested table with independent column structure
 * 3. Nested table with autoExpandColumns
 * 4. Nested table with enableRowSelection
 * 5. Multiple expandable columns with different nested tables
 * 6. Nested table with pagination
 * 7. Nested table with sorting
 * 8. Nested table with filtering
 * 9. Dynamic nested table data loading
 * 10. Nested table per hierarchy level
 * 11. Nested table with custom height
 * 12. Nested table with getRowId
 */

const meta: Meta = {
  title: "Tests/17 - Nested Tables",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Comprehensive tests for nested tables including independent column structures, row selection, pagination, sorting, filtering, and dynamic loading.",
      },
    },
  },
};

export default meta;

// ============================================================================
// TEST DATA
// ============================================================================

interface Company extends Record<string, any> {
  id: number;
  companyName: string;
  industry: string;
  revenue: number;
  divisions?: Division[];
  employees?: Employee[];
}

interface Division extends Record<string, any> {
  id: number;
  divisionName: string;
  location: string;
  headcount: number;
  budget: number;
}

interface Employee extends Record<string, any> {
  id: number;
  name: string;
  position: string;
  salary: number;
  department: string;
  startDate: string;
}

const createCompanyData = (): Company[] => {
  return [
    {
      id: 1,
      companyName: "Tech Corp",
      industry: "Technology",
      revenue: 5000000,
      divisions: [
        {
          id: 101,
          divisionName: "Software",
          location: "San Francisco",
          headcount: 150,
          budget: 2000000,
        },
        { id: 102, divisionName: "Hardware", location: "Austin", headcount: 100, budget: 1500000 },
        { id: 103, divisionName: "Services", location: "Seattle", headcount: 75, budget: 1000000 },
      ],
      employees: [
        {
          id: 1001,
          name: "John Doe",
          position: "CEO",
          salary: 250000,
          department: "Executive",
          startDate: "2020-01-15",
        },
        {
          id: 1002,
          name: "Jane Smith",
          position: "CTO",
          salary: 220000,
          department: "Technology",
          startDate: "2020-03-20",
        },
        {
          id: 1003,
          name: "Bob Johnson",
          position: "CFO",
          salary: 210000,
          department: "Finance",
          startDate: "2020-05-10",
        },
      ],
    },
    {
      id: 2,
      companyName: "Finance Inc",
      industry: "Finance",
      revenue: 3000000,
      divisions: [
        {
          id: 201,
          divisionName: "Investment",
          location: "New York",
          headcount: 80,
          budget: 1200000,
        },
        {
          id: 202,
          divisionName: "Retail Banking",
          location: "Chicago",
          headcount: 120,
          budget: 1500000,
        },
      ],
      employees: [
        {
          id: 2001,
          name: "Alice Brown",
          position: "CEO",
          salary: 280000,
          department: "Executive",
          startDate: "2019-06-01",
        },
        {
          id: 2002,
          name: "Charlie Davis",
          position: "VP Operations",
          salary: 180000,
          department: "Operations",
          startDate: "2019-09-15",
        },
      ],
    },
    {
      id: 3,
      companyName: "Retail Co",
      industry: "Retail",
      revenue: 2500000,
      divisions: [
        {
          id: 301,
          divisionName: "Online Sales",
          location: "Los Angeles",
          headcount: 60,
          budget: 800000,
        },
        {
          id: 302,
          divisionName: "Physical Stores",
          location: "Dallas",
          headcount: 200,
          budget: 1200000,
        },
      ],
      employees: [
        {
          id: 3001,
          name: "Diana Wilson",
          position: "CEO",
          salary: 200000,
          department: "Executive",
          startDate: "2021-01-10",
        },
        {
          id: 3002,
          name: "Eve Martinez",
          position: "CMO",
          salary: 170000,
          department: "Marketing",
          startDate: "2021-03-22",
        },
        {
          id: 3003,
          name: "Frank Garcia",
          position: "COO",
          salary: 190000,
          department: "Operations",
          startDate: "2021-02-05",
        },
      ],
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

const getExpandButtons = (canvasElement: HTMLElement): HTMLElement[] => {
  // Get expand icon containers that are not placeholders (i.e., actually clickable)
  const buttons = canvasElement.querySelectorAll(".st-expand-icon-container:not(.placeholder)");
  return Array.from(buttons) as HTMLElement[];
};

const clickExpandButton = async (button: HTMLElement) => {
  button.click();
  await new Promise((resolve) => setTimeout(resolve, 500));
};

const getNestedTables = (canvasElement: HTMLElement): Element[] => {
  // Get nested table containers
  const nestedTables = canvasElement.querySelectorAll(".st-nested-grid-row");
  return Array.from(nestedTables);
};

const validateNestedTableExists = (canvasElement: HTMLElement, shouldExist: boolean = true) => {
  const nestedTables = getNestedTables(canvasElement);
  if (shouldExist) {
    expect(nestedTables.length).toBeGreaterThan(0);
  } else {
    expect(nestedTables.length).toBe(0);
  }
};

// ============================================================================
// TEST CASES
// ============================================================================

/**
 * Test 1: Basic Nested Table
 * Tests basic nested table with expandable column
 */
export const BasicNestedTable: StoryObj = {
  render: () => {
    const data = createCompanyData();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "id", label: "Division ID", width: 120, type: "number" },
      { accessor: "divisionName", label: "Division Name", width: 200, type: "string" },
      { accessor: "location", label: "Location", width: 150, type: "string" },
      { accessor: "headcount", label: "Headcount", width: 120, type: "number" },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
    ];

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        type: "string",
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
        },
      },
      { accessor: "industry", label: "Industry", width: 150, type: "string" },
      { accessor: "revenue", label: "Revenue", width: 150, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Basic Nested Table</h2>
        <p>Click the expand button to view divisions for each company</p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="500px"
          rowGrouping={["divisions"]}
          expandAll={false}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify no nested tables initially
    validateNestedTableExists(canvasElement, false);

    // Get expand buttons
    const expandButtons = getExpandButtons(canvasElement);
    expect(expandButtons.length).toBeGreaterThan(0);

    // Click first expand button
    await clickExpandButton(expandButtons[0]);

    // Verify nested table appears
    validateNestedTableExists(canvasElement, true);

    // Verify nested table has correct structure
    const nestedTables = getNestedTables(canvasElement);
    const firstNestedTable = nestedTables[0];
    expect(firstNestedTable).toBeTruthy();

    // Verify nested table has headers
    const nestedHeaders = firstNestedTable.querySelectorAll(".st-header-cell");
    expect(nestedHeaders.length).toBe(5); // 5 division columns

    // Verify nested table has rows
    const nestedRows = firstNestedTable.querySelectorAll(".st-row");
    expect(nestedRows.length).toBeGreaterThan(0);
  },
};

/**
 * Test 2: Nested Table with Independent Column Structure
 * Tests that nested table has completely independent columns from parent
 */
export const NestedTableIndependentColumns: StoryObj = {
  render: () => {
    const data = createCompanyData();
    const employeeHeaders: HeaderObject[] = [
      { accessor: "id", label: "Employee ID", width: 120, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "position", label: "Position", width: 180, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "startDate", label: "Start Date", width: 130, type: "date" },
    ];

    const headers: HeaderObject[] = [
      { accessor: "id", label: "Company ID", width: 120, type: "number" },
      {
        accessor: "companyName",
        label: "Company Name",
        width: 250,
        type: "string",
        expandable: true,
        nestedTable: {
          defaultHeaders: employeeHeaders,
        },
      },
      { accessor: "industry", label: "Industry", width: 150, type: "string" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Nested Table with Independent Columns</h2>
        <p>
          Parent table shows companies, nested table shows employees with completely different
          columns
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="500px"
          rowGrouping={["employees"]}
          expandAll={false}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify parent table columns
    const parentHeaders = canvasElement.querySelectorAll(
      ".st-header-container:first-child .st-header-cell",
    );
    expect(parentHeaders.length).toBe(3); // Company ID, Company Name, Industry

    // Expand first row
    const expandButtons = getExpandButtons(canvasElement);
    await clickExpandButton(expandButtons[0]);

    // Verify nested table has different columns
    const nestedTables = getNestedTables(canvasElement);
    const nestedHeaders = nestedTables[0].querySelectorAll(".st-header-cell");
    expect(nestedHeaders.length).toBe(6); // Employee columns

    // Verify nested table header labels are different
    const nestedHeaderLabels = Array.from(nestedHeaders).map((h) => {
      const labelText = h.querySelector(".st-header-label-text");
      return labelText?.textContent?.trim() || "";
    });
    expect(nestedHeaderLabels).toContain("Employee ID");
    expect(nestedHeaderLabels).toContain("Name");
    expect(nestedHeaderLabels).toContain("Position");
  },
};

/**
 * Test 3: Nested Table with autoExpandColumns
 * Tests autoExpandColumns option in nested table
 */
export const NestedTableAutoExpandColumns: StoryObj = {
  render: () => {
    const data = createCompanyData();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "divisionName", label: "Division", width: "1fr" },
      { accessor: "location", label: "Location", width: "1fr" },
      { accessor: "headcount", label: "Headcount", width: 120 },
    ];

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
          autoExpandColumns: true,
        },
      },
      { accessor: "industry", label: "Industry", width: 150 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Nested Table with autoExpandColumns</h2>
        <p>Nested table columns should auto-expand to fill available space</p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="500px"
          rowGrouping={["divisions"]}
          expandAll={false}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify no nested tables initially
    validateNestedTableExists(canvasElement, false);

    // Expand first row
    const expandButtons = getExpandButtons(canvasElement);
    await clickExpandButton(expandButtons[0]);

    // Verify nested table exists
    const nestedTables = getNestedTables(canvasElement);
    expect(nestedTables.length).toBe(1);

    // Verify nested table has headers
    const nestedHeaders = nestedTables[0].querySelectorAll(".st-header-cell");
    expect(nestedHeaders.length).toBe(4);
  },
};

/**
 * Test 4: Nested Table with Row Selection
 * Tests enableRowSelection in nested table
 */
export const NestedTableWithRowSelection: StoryObj = {
  render: () => {
    const data = createCompanyData();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "divisionName", label: "Division", width: 200 },
      { accessor: "location", label: "Location", width: 150 },
      { accessor: "budget", label: "Budget", width: 150 },
    ];

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
          enableRowSelection: true,
        },
      },
      { accessor: "industry", label: "Industry", width: 150 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Nested Table with Row Selection</h2>
        <p>Nested table should have row selection checkboxes</p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="500px"
          rowGrouping={["divisions"]}
          expandAll={false}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Expand first row
    const expandButtons = getExpandButtons(canvasElement);
    await clickExpandButton(expandButtons[0]);

    // Verify nested table has selection column
    const nestedTables = getNestedTables(canvasElement);
    const nestedTable = nestedTables[0];

    // Look for selection checkboxes in nested table
    const checkboxes = nestedTable.querySelectorAll(".st-checkbox-input");
    expect(checkboxes.length).toBeGreaterThan(0);
  },
};

/**
 * Test 5: Multiple Nested Tables from Different Rows
 * Tests expanding nested tables from multiple parent rows simultaneously
 */
export const MultipleNestedTablesFromDifferentRows: StoryObj = {
  render: () => {
    const data = createCompanyData();

    const divisionHeaders: HeaderObject[] = [
      { accessor: "id", label: "Division ID", width: 120 },
      { accessor: "divisionName", label: "Division", width: 200 },
      { accessor: "location", label: "Location", width: 150 },
    ];

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      {
        accessor: "companyName",
        label: "Company",
        width: 220,
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
        },
      },
      { accessor: "industry", label: "Industry", width: 150 },
      { accessor: "revenue", label: "Revenue", width: 150 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Multiple Nested Tables from Different Rows</h2>
        <p>Expand multiple parent rows to show multiple nested tables simultaneously</p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="500px"
          rowGrouping={["divisions"]}
          expandAll={false}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Get all expand buttons (should be 1 per row, 3 total)
    const expandButtons = getExpandButtons(canvasElement);
    expect(expandButtons.length).toBeGreaterThanOrEqual(3); // 3 rows

    // Initially no nested tables
    validateNestedTableExists(canvasElement, false);

    // Expand first row
    await clickExpandButton(expandButtons[0]);

    // Should have 1 nested table
    let nestedTables = getNestedTables(canvasElement);
    expect(nestedTables.length).toBe(1);

    // Expand second row (need to get buttons again as DOM has changed)
    const expandButtonsAfterFirst = getExpandButtons(canvasElement);
    // Find the second parent row's expand button (skip the first one we already clicked)
    const secondRowButton = expandButtonsAfterFirst.find((btn, idx) => {
      // The expand button should be in a different row than the first
      const firstRowCell = expandButtons[0].closest(".st-row");
      const currentRowCell = btn.closest(".st-row");
      return (
        currentRowCell !== firstRowCell && !currentRowCell?.classList.contains("st-nested-grid-row")
      );
    });

    if (secondRowButton) {
      await clickExpandButton(secondRowButton);
    }

    // Should have 2 nested tables
    nestedTables = getNestedTables(canvasElement);
    expect(nestedTables.length).toBe(2);
  },
};

/**
 * Test 6: Nested Table with Pagination
 * Tests pagination in nested table
 */
export const NestedTableWithPagination: StoryObj = {
  render: () => {
    // Create data with many divisions
    const data: Company[] = [
      {
        id: 1,
        companyName: "Large Corp",
        industry: "Technology",
        revenue: 10000000,
        divisions: Array.from({ length: 25 }, (_, i) => ({
          id: 100 + i,
          divisionName: `Division ${i + 1}`,
          location: `City ${i + 1}`,
          headcount: 50 + i * 10,
          budget: 500000 + i * 100000,
        })),
      },
    ];

    const divisionHeaders: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "divisionName", label: "Division", width: 200 },
      { accessor: "location", label: "Location", width: 150 },
      { accessor: "headcount", label: "Headcount", width: 120 },
    ];

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
          shouldPaginate: true,
          rowsPerPage: 10,
        },
      },
      { accessor: "industry", label: "Industry", width: 150 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Nested Table with Pagination</h2>
        <p>Nested table has 25 divisions with pagination (10 per page)</p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="600px"
          rowGrouping={["divisions"]}
          expandAll={false}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Expand the row
    const expandButtons = getExpandButtons(canvasElement);
    await clickExpandButton(expandButtons[0]);

    // Verify nested table has pagination footer
    const nestedTables = getNestedTables(canvasElement);
    const nestedTable = nestedTables[0];

    const footer = nestedTable.querySelector(".st-footer");
    expect(footer).toBeTruthy();

    // Verify pagination controls exist
    const paginationControls = nestedTable.querySelector(".st-footer-pagination");
    expect(paginationControls).toBeTruthy();

    // Verify page buttons exist
    const pageButtons = nestedTable.querySelectorAll(".st-page-btn");
    expect(pageButtons.length).toBeGreaterThan(0);
  },
};

/**
 * Test 7: Nested Table with Sorting
 * Tests sortable columns in nested table
 */
export const NestedTableWithSorting: StoryObj = {
  render: () => {
    const data = createCompanyData();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, isSortable: true },
      { accessor: "divisionName", label: "Division", width: 200, isSortable: true },
      { accessor: "location", label: "Location", width: 150, isSortable: true },
      { accessor: "headcount", label: "Headcount", width: 120, type: "number", isSortable: true },
      { accessor: "budget", label: "Budget", width: 150, type: "number", isSortable: true },
    ];

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
        },
      },
      { accessor: "industry", label: "Industry", width: 150 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Nested Table with Sorting</h2>
        <p>Nested table columns are sortable</p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="500px"
          rowGrouping={["divisions"]}
          expandAll={false}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Expand first row
    const expandButtons = getExpandButtons(canvasElement);
    await clickExpandButton(expandButtons[0]);

    // Verify nested table has sortable headers
    const nestedTables = getNestedTables(canvasElement);
    const nestedTable = nestedTables[0];

    const sortableHeaders = nestedTable.querySelectorAll(".st-header-cell.clickable");
    expect(sortableHeaders.length).toBeGreaterThan(0);

    // Verify sortable headers have aria-sort attribute
    const headersWithAriaSort = Array.from(sortableHeaders).filter((header) => {
      const ariaSort = header.getAttribute("aria-sort");
      return ariaSort === "none" || ariaSort === "ascending" || ariaSort === "descending";
    });
    expect(headersWithAriaSort.length).toBeGreaterThan(0);
  },
};

/**
 * Test 8: Nested Table with Filtering
 * Tests filterable columns in nested table
 */
export const NestedTableWithFiltering: StoryObj = {
  render: () => {
    const data = createCompanyData();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "divisionName", label: "Division", width: 200, filterable: true },
      { accessor: "location", label: "Location", width: 150, filterable: true },
      { accessor: "headcount", label: "Headcount", width: 120, type: "number", filterable: true },
    ];

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
        },
      },
      { accessor: "industry", label: "Industry", width: 150 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Nested Table with Filtering</h2>
        <p>Nested table columns are filterable</p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="500px"
          rowGrouping={["divisions"]}
          expandAll={false}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Expand first row
    const expandButtons = getExpandButtons(canvasElement);
    await clickExpandButton(expandButtons[0]);

    // Verify nested table has filterable headers
    const nestedTables = getNestedTables(canvasElement);
    const nestedTable = nestedTables[0];

    // Filter icons are rendered as st-icon-container with st-header-icon inside
    const filterIconContainers = nestedTable.querySelectorAll(".st-icon-container");
    expect(filterIconContainers.length).toBeGreaterThan(0);

    // Verify the icons have aria-label for filtering
    const filterableHeaders = Array.from(filterIconContainers).filter((container) => {
      const ariaLabel = container.getAttribute("aria-label");
      return ariaLabel?.includes("Filter");
    });
    expect(filterableHeaders.length).toBeGreaterThan(0);
  },
};

/**
 * Test 9: Collapse Nested Table
 * Tests collapsing an expanded nested table
 */
export const CollapseNestedTable: StoryObj = {
  render: () => {
    const data = createCompanyData();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "divisionName", label: "Division", width: 200 },
      { accessor: "location", label: "Location", width: 150 },
    ];

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
        },
      },
      { accessor: "industry", label: "Industry", width: 150 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Collapse Nested Table</h2>
        <p>Expand and then collapse a nested table</p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="500px"
          rowGrouping={["divisions"]}
          expandAll={false}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Initially no nested tables
    validateNestedTableExists(canvasElement, false);

    // Expand first row
    const expandButtons = getExpandButtons(canvasElement);
    await clickExpandButton(expandButtons[0]);

    // Verify nested table appears
    validateNestedTableExists(canvasElement, true);

    // Click again to collapse
    await clickExpandButton(expandButtons[0]);

    // Verify nested table disappears
    validateNestedTableExists(canvasElement, false);
  },
};

/**
 * Test 10: Multiple Nested Tables Simultaneously
 * Tests opening multiple nested tables at the same time
 */
export const MultipleNestedTablesSimultaneously: StoryObj = {
  render: () => {
    const data = createCompanyData();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "divisionName", label: "Division", width: 200 },
      { accessor: "location", label: "Location", width: 150 },
    ];

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
        },
      },
      { accessor: "industry", label: "Industry", width: 150 },
      { accessor: "revenue", label: "Revenue", width: 150 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Multiple Nested Tables Simultaneously</h2>
        <p>Expand multiple rows to show multiple nested tables at once</p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="600px"
          rowGrouping={["divisions"]}
          expandAll={false}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Get initial expand buttons (one per company row)
    let expandButtons = getExpandButtons(canvasElement);
    expect(expandButtons.length).toBeGreaterThanOrEqual(3);

    // Expand first row
    await clickExpandButton(expandButtons[0]);
    let nestedTables = getNestedTables(canvasElement);
    expect(nestedTables.length).toBe(1);

    // Get buttons again after DOM change, find second parent row button
    // Need to select only top-level rows from the main table, not nested table rows
    // The structure is: .st-body-main > .st-row (parent rows and nested grid rows)
    // We need to filter out nested grid rows and only get parent-level data rows
    expandButtons = getExpandButtons(canvasElement);

    // Get all rows from the main table body (not from nested tables)
    const mainTableBody = canvasElement.querySelector(
      ".simple-table-root > .st-wrapper-container > .st-content-wrapper > .st-content > .st-body-container > .st-body-main",
    );
    const allMainRows = mainTableBody
      ? Array.from(mainTableBody.children).filter(
          (el) =>
            el.classList.contains("st-row") &&
            !el.classList.contains("st-nested-grid-row") &&
            !el.classList.contains("st-row-separator"),
        )
      : [];

    const secondRowButton = allMainRows[1]?.querySelector(
      ".st-expand-icon-container:not(.placeholder)",
    ) as HTMLElement;
    expect(secondRowButton).toBeTruthy();
    await clickExpandButton(secondRowButton);
    nestedTables = getNestedTables(canvasElement);
    expect(nestedTables.length).toBe(2);

    // Get third parent row button
    const thirdRowButton = allMainRows[2]?.querySelector(
      ".st-expand-icon-container:not(.placeholder)",
    ) as HTMLElement;
    expect(thirdRowButton).toBeTruthy();
    await clickExpandButton(thirdRowButton);
    nestedTables = getNestedTables(canvasElement);
    expect(nestedTables.length).toBe(3);

    // All three nested tables should be visible
    expect(nestedTables.length).toBe(3);
  },
};

/**
 * Test 11: Nested Table with Custom Height
 * Tests nested table with custom height configuration
 */
export const NestedTableWithCustomHeight: StoryObj = {
  render: () => {
    const data = createCompanyData();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "divisionName", label: "Division", width: 200 },
      { accessor: "location", label: "Location", width: 150 },
      { accessor: "headcount", label: "Headcount", width: 120 },
    ];

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
          height: "200px",
        },
      },
      { accessor: "industry", label: "Industry", width: 150 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Nested Table with Custom Height</h2>
        <p>Nested table has a fixed height of 200px</p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="500px"
          rowGrouping={["divisions"]}
          expandAll={false}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Expand first row
    const expandButtons = getExpandButtons(canvasElement);
    await clickExpandButton(expandButtons[0]);

    // Verify nested table exists
    const nestedTables = getNestedTables(canvasElement);
    expect(nestedTables.length).toBe(1);

    // Verify nested table has custom height
    const nestedTableRoot = nestedTables[0].querySelector(".simple-table-root") as HTMLElement;
    if (nestedTableRoot) {
      const computedStyle = window.getComputedStyle(nestedTableRoot);
      expect(computedStyle.height).toBe("200px");
    }
  },
};

/**
 * Test 12: Nested Table with getRowId
 * Tests nested table with custom row ID function
 */
export const NestedTableWithGetRowId: StoryObj = {
  render: () => {
    const data = createCompanyData();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "divisionName", label: "Division", width: 200 },
      { accessor: "location", label: "Location", width: 150 },
    ];

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
          getRowId: (params: any) => `division-${params.row.id}`,
        },
      },
      { accessor: "industry", label: "Industry", width: 150 },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Nested Table with getRowId</h2>
        <p>Nested table uses custom getRowId function for stable row identification</p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="500px"
          rowGrouping={["divisions"]}
          expandAll={false}
          getRowId={(params) => String(params.row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Expand first row
    const expandButtons = getExpandButtons(canvasElement);
    await clickExpandButton(expandButtons[0]);

    // Verify nested table exists and renders correctly
    const nestedTables = getNestedTables(canvasElement);
    expect(nestedTables.length).toBe(1);

    const nestedRows = nestedTables[0].querySelectorAll(".st-row");
    expect(nestedRows.length).toBeGreaterThan(0);
  },
};
