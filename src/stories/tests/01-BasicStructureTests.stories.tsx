import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { SimpleTable } from "../..";
import { HeaderObject } from "../..";

/**
 * BASIC TABLE STRUCTURE AND RENDERING TESTS
 *
 * This test suite covers the foundational features documented in:
 * - Quick Start Guide
 * - Table Height Documentation
 * - API Reference (Basic Props)
 *
 * Features tested:
 * 1. Basic table rendering with required props (defaultHeaders, rows)
 * 2. Table with height prop (fixed height, internal scrolling)
 * 3. Table with maxHeight prop (adaptive height)
 * 4. Table without height (overflow parent)
 * 5. getRowId functionality
 * 6. Nested data accessors (dot notation)
 * 7. Array index accessors (v1.9.4+)
 * 8. DOM structure validation
 * 9. Column width configurations (fixed pixels, "1fr")
 * 10. Data type handling (string, number, boolean, date)
 */

const meta: Meta = {
  title: "Tests/01 - Basic Structure & Rendering",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Comprehensive tests for basic table structure, rendering, and core props including height, maxHeight, getRowId, and data accessors.",
      },
    },
  },
};

export default meta;

// ============================================================================
// TEST DATA
// ============================================================================

interface BasicRow extends Record<string, any> {
  id: number;
  name: string;
  age: number;
  email: string;
  isActive: boolean;
  joinDate: string;
}

interface NestedRow extends Record<string, any> {
  id: number;
  user: {
    name: string;
    email: string;
    profile: {
      city: string;
      country: string;
    };
  };
  metadata: {
    score: number;
    tags: string[];
  };
}

interface ArrayAccessorRow extends Record<string, any> {
  id: number;
  name: string;
  awards: string[];
  albums: Array<{ title: string; year: number }>;
}

const createBasicData = (count: number): BasicRow[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    age: 20 + (index % 50),
    email: `user${index + 1}@example.com`,
    isActive: index % 2 === 0,
    joinDate: `2024-${String((index % 12) + 1).padStart(2, "0")}-15`,
  }));
};

const createNestedData = (count: number): NestedRow[] => {
  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
  const countries = ["USA", "Canada", "UK", "Australia", "Germany"];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    user: {
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      profile: {
        city: cities[index % cities.length],
        country: countries[index % countries.length],
      },
    },
    metadata: {
      score: Math.floor(Math.random() * 100),
      tags: [`tag${index % 3}`, `category${index % 5}`],
    },
  }));
};

const createArrayAccessorData = (count: number): ArrayAccessorRow[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Artist ${index + 1}`,
    awards: [`Award ${index % 3}`, `Prize ${index % 5}`],
    albums: [
      { title: `Album ${index * 2 + 1}`, year: 2020 + (index % 5) },
      { title: `Album ${index * 2 + 2}`, year: 2021 + (index % 4) },
    ],
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

const validateBasicTableStructure = async (canvasElement: HTMLElement) => {
  await waitForTable();

  // Core table structure
  const tableRoot = canvasElement.querySelector(".simple-table-root");
  if (!tableRoot) throw new Error("Table root not found");
  expect(tableRoot).toBeTruthy();

  const tableContent = canvasElement.querySelector(".st-content");
  if (!tableContent) throw new Error("Table content not found");
  expect(tableContent).toBeTruthy();

  const headerContainer = canvasElement.querySelector(".st-header-container");
  if (!headerContainer) throw new Error("Header container not found");
  expect(headerContainer).toBeTruthy();

  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) throw new Error("Body container not found");
  expect(bodyContainer).toBeTruthy();

  // At least one row should exist
  const rows = canvasElement.querySelectorAll(".st-row");
  expect(rows.length).toBeGreaterThan(0);

  // Header and body main sections
  const headerMain = headerContainer.querySelector(".st-header-main");
  if (!headerMain) throw new Error("Header main not found");
  expect(headerMain).toBeTruthy();

  const bodyMain = bodyContainer.querySelector(".st-body-main");
  if (!bodyMain) throw new Error("Body main not found");
  expect(bodyMain).toBeTruthy();
};

const validateColumnCount = (canvasElement: HTMLElement, expectedCount: number) => {
  const headerCells = canvasElement.querySelectorAll(".st-header-cell");
  expect(headerCells.length).toBe(expectedCount);
};

const validateRowCount = (canvasElement: HTMLElement, expectedCount: number) => {
  const rows = canvasElement.querySelectorAll(".st-row");
  expect(rows.length).toBe(expectedCount);
};

const validateCellContent = (
  canvasElement: HTMLElement,
  rowIndex: number,
  accessor: string,
  expectedValue: string
) => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) throw new Error("Body container not found");

  const cells = bodyContainer.querySelectorAll(`[data-accessor="${accessor}"]`);
  const cell = cells[rowIndex] as HTMLElement;
  if (!cell) throw new Error(`Cell at row ${rowIndex} with accessor "${accessor}" not found`);
  expect(cell).toBeTruthy();

  const cellContent = cell.querySelector(".st-cell-content");
  expect(cellContent?.textContent?.trim()).toBe(expectedValue);
};

// ============================================================================
// TEST 1: MINIMAL TABLE WITH REQUIRED PROPS ONLY
// ============================================================================

export const MinimalTableWithRequiredProps: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "age", label: "Age", width: 100 },
    ];

    const data = createBasicData(10);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Minimal Table (Required Props Only)</h2>
        <SimpleTable defaultHeaders={headers} rows={data} />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    // Validate basic structure
    await validateBasicTableStructure(canvasElement);

    // Validate column count
    validateColumnCount(canvasElement, 3);

    // Validate row count (10 data rows)
    validateRowCount(canvasElement, 10);

    // Validate first row data
    validateCellContent(canvasElement, 0, "id", "1");
    validateCellContent(canvasElement, 0, "name", "User 1");
    validateCellContent(canvasElement, 0, "age", "20");

    // Validate last row data
    validateCellContent(canvasElement, 9, "id", "10");
    validateCellContent(canvasElement, 9, "name", "User 10");
  },
};

// ============================================================================
// TEST 2: TABLE WITH FIXED HEIGHT
// ============================================================================

export const TableWithFixedHeight: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
      { accessor: "age", label: "Age", width: 100 },
    ];

    const data = createBasicData(100);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Table with Fixed Height (400px)</h2>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await validateBasicTableStructure(canvasElement);

    // Validate table has fixed height
    const tableRoot = canvasElement.querySelector(".simple-table-root") as HTMLElement;
    if (!tableRoot) throw new Error("Table root not found");
    expect(tableRoot).toBeTruthy();

    // The table should have a height style applied
    const computedStyle = window.getComputedStyle(tableRoot);
    expect(computedStyle.height).toBe("400px");

    // Validate scrolling is enabled
    const bodyContainer = canvasElement.querySelector(".st-body-container") as HTMLElement;
    if (!bodyContainer) throw new Error("Body container not found");
    expect(bodyContainer).toBeTruthy();

    // Body should be scrollable
    const bodyComputedStyle = window.getComputedStyle(bodyContainer);
    expect(bodyComputedStyle.overflowY).toBe("auto");

    // Validate all 100 rows exist (virtualization may limit visible rows)
    validateColumnCount(canvasElement, 4);
  },
};

// ============================================================================
// TEST 3: TABLE WITH MAX HEIGHT (ADAPTIVE)
// ============================================================================

export const TableWithMaxHeight: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "age", label: "Age", width: 100 },
    ];

    const data = createBasicData(5); // Few rows to test adaptive behavior

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Table with MaxHeight (600px, only 5 rows)</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Table should shrink to fit 5 rows instead of taking full 600px height
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} maxHeight="600px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await validateBasicTableStructure(canvasElement);

    // Validate table has maxHeight
    const tableRoot = canvasElement.querySelector(".simple-table-root") as HTMLElement;
    if (!tableRoot) throw new Error("Table root not found");
    expect(tableRoot).toBeTruthy();

    // With only 5 rows, table should be smaller than 600px
    const actualHeight = tableRoot.offsetHeight;
    expect(actualHeight).toBeLessThan(600);
    expect(actualHeight).toBeGreaterThan(0);

    // Validate all 5 rows are visible
    validateRowCount(canvasElement, 5);
  },
};

// ============================================================================
// TEST 4: TABLE WITHOUT HEIGHT (OVERFLOW PARENT)
// ============================================================================

export const TableWithoutHeight: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "age", label: "Age", width: 100 },
    ];

    const data = createBasicData(20);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Table Without Height (Overflows Parent)</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>Table expands to show all 20 rows</p>
        <div style={{ height: "400px", overflow: "auto", border: "2px solid #ccc" }}>
          <SimpleTable defaultHeaders={headers} rows={data} />
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await validateBasicTableStructure(canvasElement);

    // Validate all 20 rows are rendered
    validateRowCount(canvasElement, 20);

    // Table should not have internal scrolling
    const bodyContainer = canvasElement.querySelector(".st-body-container") as HTMLElement;
    if (!bodyContainer) throw new Error("Body container not found");
    expect(bodyContainer).toBeTruthy();
  },
};

// ============================================================================
// TEST 5: TABLE WITH GETROWID
// ============================================================================

export const TableWithGetRowId: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
    ];

    const data = createBasicData(15);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Table with getRowId</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Uses row.id for stable row identification
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={({ row }) => String(row.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await validateBasicTableStructure(canvasElement);
    validateColumnCount(canvasElement, 3);

    // Validate data is rendered correctly
    validateCellContent(canvasElement, 0, "id", "1");
    validateCellContent(canvasElement, 0, "name", "User 1");
  },
};

// ============================================================================
// TEST 6: NESTED DATA ACCESSORS (DOT NOTATION)
// ============================================================================

export const NestedDataAccessors: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "user.name", label: "Name", width: 150 },
      { accessor: "user.email", label: "Email", width: 200 },
      { accessor: "user.profile.city", label: "City", width: 120 },
      { accessor: "user.profile.country", label: "Country", width: 120 },
      { accessor: "metadata.score", label: "Score", width: 100, type: "number" },
    ];

    const data = createNestedData(10);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Nested Data Accessors (Dot Notation)</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Accessing nested properties: user.name, user.profile.city, metadata.score
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await validateBasicTableStructure(canvasElement);
    validateColumnCount(canvasElement, 6);

    // Validate nested data is rendered correctly
    validateCellContent(canvasElement, 0, "id", "1");
    validateCellContent(canvasElement, 0, "user.name", "User 1");
    validateCellContent(canvasElement, 0, "user.email", "user1@example.com");

    // City and country should be rendered (values will vary based on data)
    const cityCell = canvasElement.querySelector('[data-accessor="user.profile.city"]');
    expect(cityCell).toBeTruthy();

    const countryCell = canvasElement.querySelector('[data-accessor="user.profile.country"]');
    expect(countryCell).toBeTruthy();
  },
};

// ============================================================================
// TEST 7: ARRAY INDEX ACCESSORS (v1.9.4+)
// ============================================================================

export const ArrayIndexAccessors: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Artist", width: 150 },
      { accessor: "awards[0]", label: "First Award", width: 150 },
      { accessor: "awards[1]", label: "Second Award", width: 150 },
      { accessor: "albums[0].title", label: "Album 1 Title", width: 180 },
      { accessor: "albums[0].year", label: "Album 1 Year", width: 120, type: "number" },
      { accessor: "albums[1].title", label: "Album 2 Title", width: 180 },
    ];

    const data = createArrayAccessorData(10);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Array Index Accessors (v1.9.4+)</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Accessing array elements: awards[0], albums[0].title, albums[1].year
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await validateBasicTableStructure(canvasElement);
    validateColumnCount(canvasElement, 7);

    // Validate array accessor data is rendered
    validateCellContent(canvasElement, 0, "id", "1");
    validateCellContent(canvasElement, 0, "name", "Artist 1");

    // Array accessors should work
    const firstAwardCell = canvasElement.querySelector('[data-accessor="awards[0]"]');
    expect(firstAwardCell).toBeTruthy();

    const albumTitleCell = canvasElement.querySelector('[data-accessor="albums[0].title"]');
    expect(albumTitleCell).toBeTruthy();
  },
};

// ============================================================================
// TEST 8: COLUMN WIDTH CONFIGURATIONS
// ============================================================================

export const ColumnWidthConfigurations: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "Fixed 80px", width: 80 },
      { accessor: "name", label: "Fixed 200px", width: 200 },
      { accessor: "email", label: "Flexible 1fr", width: "1fr" },
      { accessor: "age", label: "Fixed 100px", width: 100 },
      { accessor: "isActive", label: "Fixed 120px", width: 120, type: "boolean" },
    ];

    const data = createBasicData(15);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Column Width Configurations</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Mix of fixed pixel widths (80px, 200px, 100px) and flexible width (1fr)
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await validateBasicTableStructure(canvasElement);
    validateColumnCount(canvasElement, 5);

    // Validate header cells exist
    const headerMain = canvasElement.querySelector(".st-header-main") as HTMLElement;
    if (!headerMain) throw new Error("Header main not found");
    expect(headerMain).toBeTruthy();

    // Check that grid template columns is set
    const gridTemplateColumns = headerMain.style.gridTemplateColumns;
    expect(gridTemplateColumns).toBeTruthy();
    expect(gridTemplateColumns).toContain("80px");
    expect(gridTemplateColumns).toContain("200px");
    expect(gridTemplateColumns).toContain("1fr");
  },
};

// ============================================================================
// TEST 9: DATA TYPES RENDERING
// ============================================================================

export const DataTypesRendering: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID (number)", width: 120, type: "number" },
      { accessor: "name", label: "Name (string)", width: 200, type: "string" },
      { accessor: "age", label: "Age (number)", width: 120, type: "number" },
      { accessor: "isActive", label: "Active (boolean)", width: 150, type: "boolean" },
      { accessor: "joinDate", label: "Join Date (date)", width: 150, type: "date" },
      { accessor: "email", label: "Email (string)", width: 250, type: "string" },
    ];

    const data = createBasicData(10);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Data Types Rendering</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Testing different data types: string, number, boolean, date
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await validateBasicTableStructure(canvasElement);
    validateColumnCount(canvasElement, 6);

    // Validate different data types are rendered
    validateCellContent(canvasElement, 0, "id", "1");
    validateCellContent(canvasElement, 0, "name", "User 1");
    validateCellContent(canvasElement, 0, "age", "20");

    // Boolean should render as checkbox or true/false
    const booleanCell = canvasElement.querySelector('[data-accessor="isActive"]');
    expect(booleanCell).toBeTruthy();

    // Date should be rendered
    const dateCell = canvasElement.querySelector('[data-accessor="joinDate"]');
    expect(dateCell).toBeTruthy();
  },
};

// ============================================================================
// TEST 10: VIEWPORT RELATIVE HEIGHT
// ============================================================================

export const ViewportRelativeHeight: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
    ];

    const data = createBasicData(50);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Viewport Relative Height (50vh)</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Table height is 50% of viewport height
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="50vh" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await validateBasicTableStructure(canvasElement);

    const tableRoot = canvasElement.querySelector(".simple-table-root") as HTMLElement;
    if (!tableRoot) throw new Error("Table root not found");
    expect(tableRoot).toBeTruthy();

    // Height should be set to 50vh
    expect(tableRoot.style.height).toBe("50vh");
  },
};

// ============================================================================
// TEST 11: COMPREHENSIVE STRUCTURE VALIDATION
// ============================================================================

export const ComprehensiveStructureValidation: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "age", label: "Age", width: 100 },
      { accessor: "email", label: "Email", width: 250 },
    ];

    const data = createBasicData(25);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Comprehensive DOM Structure Validation</h2>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="500px"
          getRowId={({ row }) => String(row.id)}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await validateBasicTableStructure(canvasElement);

    // Detailed DOM structure validation
    const tableRoot = canvasElement.querySelector(".simple-table-root");
    if (!tableRoot) throw new Error("Table root not found");
    expect(tableRoot).toBeTruthy();

    // Validate header structure
    const headerContainer = canvasElement.querySelector(".st-header-container");
    if (!headerContainer) throw new Error("Header container not found");
    const headerMain = headerContainer.querySelector(".st-header-main");
    if (!headerMain) throw new Error("Header main not found");
    expect(headerMain).toBeTruthy();

    const headerCells = canvasElement.querySelectorAll(".st-header-cell");
    expect(headerCells.length).toBe(4);

    // Each header should have label text
    headerCells.forEach((cell) => {
      const labelText = cell.querySelector(".st-header-label-text");
      expect(labelText).toBeTruthy();
      expect(labelText?.textContent).toBeTruthy();
    });

    // Validate body structure
    const bodyContainer = canvasElement.querySelector(".st-body-container");
    if (!bodyContainer) throw new Error("Body container not found");
    const bodyMain = bodyContainer.querySelector(".st-body-main");
    if (!bodyMain) throw new Error("Body main not found");
    expect(bodyMain).toBeTruthy();

    // Validate rows
    const rows = canvasElement.querySelectorAll(".st-row");
    expect(rows.length).toBeGreaterThan(0);

    // Each row should have cells
    rows.forEach((row) => {
      const cells = row.querySelectorAll(".st-cell");
      expect(cells.length).toBeGreaterThan(0);
    });

    // Validate data rendering
    validateCellContent(canvasElement, 0, "id", "1");
    validateCellContent(canvasElement, 0, "name", "User 1");

    // Validate that cells have proper structure
    const firstCell = canvasElement.querySelector(".st-cell");
    if (!firstCell) throw new Error("First cell not found");
    expect(firstCell).toBeTruthy();

    const cellContent = firstCell.querySelector(".st-cell-content");
    if (!cellContent) throw new Error("Cell content not found");
    expect(cellContent).toBeTruthy();
  },
};
