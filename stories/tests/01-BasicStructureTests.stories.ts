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

import { HeaderObject } from "../../src/index";
import { expect } from "@storybook/test";
import {
  validateBasicTableStructure,
  validateColumnCount,
  validateRowCount,
  validateCellContent,
} from "./testUtils";
import { renderVanillaTable } from "../utils";
import type { Meta } from "@storybook/html";

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

const createBasicData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    age: 20 + (index % 50),
    email: `user${index + 1}@example.com`,
    isActive: index % 2 === 0,
    joinDate: `2024-${String((index % 12) + 1).padStart(2, "0")}-15`,
  }));
};

const createNestedData = (count) => {
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

const createArrayAccessorData = (count) => {
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
// TEST 1: MINIMAL TABLE WITH REQUIRED PROPS ONLY
// ============================================================================

export const MinimalTableWithRequiredProps = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "age", label: "Age", width: 100 },
    ];
    const data = createBasicData(10);
    const { wrapper, h2 } = renderVanillaTable(headers, data);
    h2.textContent = "Minimal Table (Required Props Only)";
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await validateBasicTableStructure(canvasElement);
    validateColumnCount(canvasElement, 3);
    validateRowCount(canvasElement, 10);
    validateCellContent(canvasElement, 0, "id", "1");
    validateCellContent(canvasElement, 0, "name", "User 1");
    validateCellContent(canvasElement, 0, "age", "20");
    validateCellContent(canvasElement, 9, "id", "10");
    validateCellContent(canvasElement, 9, "name", "User 10");
  },
};

// ============================================================================
// TEST 2: TABLE WITH FIXED HEIGHT
// ============================================================================

export const TableWithFixedHeight = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
      { accessor: "age", label: "Age", width: 100 },
    ];
    const data = createBasicData(100);
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      height: "400px",
    });
    h2.textContent = "Table with Fixed Height (400px)";
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await validateBasicTableStructure(canvasElement);
    const tableRoot = canvasElement.querySelector(".simple-table-root");
    if (!tableRoot) throw new Error("Table root not found");
    expect(tableRoot).toBeTruthy();
    const computedStyle = window.getComputedStyle(tableRoot);
    expect(computedStyle.height).toBe("400px");
    const bodyContainer = canvasElement.querySelector(".st-body-container");
    if (!bodyContainer) throw new Error("Body container not found");
    expect(bodyContainer).toBeTruthy();
    const bodyComputedStyle = window.getComputedStyle(bodyContainer);
    expect(bodyComputedStyle.overflowY).toBe("auto");
    validateColumnCount(canvasElement, 4);
  },
};

// ============================================================================
// TEST 3: TABLE WITH MAX HEIGHT (ADAPTIVE)
// ============================================================================

export const TableWithMaxHeight = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "age", label: "Age", width: 100 },
    ];
    const data = createBasicData(5);
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      maxHeight: "600px",
    });
    h2.textContent =
      "Table with MaxHeight (600px, only 5 rows)";
    const p = document.createElement("p");
    p.style.marginBottom = "1rem";
    p.style.color = "#666";
    p.textContent =
      "Table should shrink to fit 5 rows instead of taking full 600px height";
    wrapper.insertBefore(p, wrapper.querySelector("div"));
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await validateBasicTableStructure(canvasElement);
    const tableRoot = canvasElement.querySelector(".simple-table-root");
    if (!tableRoot) throw new Error("Table root not found");
    expect(tableRoot).toBeTruthy();
    const actualHeight = tableRoot.offsetHeight;
    expect(actualHeight).toBeLessThan(600);
    expect(actualHeight).toBeGreaterThan(0);
    validateRowCount(canvasElement, 5);
  },
};

// ============================================================================
// TEST 4: TABLE WITHOUT HEIGHT (OVERFLOW PARENT)
// ============================================================================

export const TableWithoutHeight = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "age", label: "Age", width: 100 },
    ];
    const data = createBasicData(20);
    const { wrapper, h2 } = renderVanillaTable(headers, data);
    h2.textContent = "Table Without Height (Overflows Parent)";
    const p = document.createElement("p");
    p.style.marginBottom = "1rem";
    p.style.color = "#666";
    p.textContent = "Table expands to show all 20 rows";
    wrapper.insertBefore(p, wrapper.querySelector("div"));
    const scrollWrapper = document.createElement("div");
    scrollWrapper.style.height = "400px";
    scrollWrapper.style.overflow = "auto";
    scrollWrapper.style.border = "2px solid #ccc";
    const tableContainer = wrapper.querySelector("div:last-child");
    if (!tableContainer) throw new Error("Table container not found");
    const tableDiv = tableContainer.querySelector(".simple-table-root")
      ? tableContainer
      : tableContainer.firstElementChild || tableContainer;
    scrollWrapper.appendChild(tableDiv);
    wrapper.appendChild(scrollWrapper);
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await validateBasicTableStructure(canvasElement);
    validateRowCount(canvasElement, 20);
    const bodyContainer = canvasElement.querySelector(".st-body-container");
    if (!bodyContainer) throw new Error("Body container not found");
    expect(bodyContainer).toBeTruthy();
  },
};

// ============================================================================
// TEST 5: TABLE WITH GETROWID
// ============================================================================

export const TableWithGetRowId = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
    ];
    const data = createBasicData(15);
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      getRowId: ({ row }) => String(row.id),
      height: "400px",
    });
    h2.textContent = "Table with getRowId";
    const p = document.createElement("p");
    p.style.marginBottom = "1rem";
    p.style.color = "#666";
    p.textContent = "Uses row.id for stable row identification";
    wrapper.insertBefore(p, wrapper.querySelector("div:last-child"));
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await validateBasicTableStructure(canvasElement);
    validateColumnCount(canvasElement, 3);
    validateCellContent(canvasElement, 0, "id", "1");
    validateCellContent(canvasElement, 0, "name", "User 1");
  },
};

// ============================================================================
// TEST 6: NESTED DATA ACCESSORS (DOT NOTATION)
// ============================================================================

export const NestedDataAccessors = {
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
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      height: "400px",
    });
    h2.textContent = "Nested Data Accessors (Dot Notation)";
    const p = document.createElement("p");
    p.style.marginBottom = "1rem";
    p.style.color = "#666";
    p.textContent =
      "Accessing nested properties: user.name, user.profile.city, metadata.score";
    wrapper.insertBefore(p, wrapper.querySelector("div:last-child"));
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await validateBasicTableStructure(canvasElement);
    validateColumnCount(canvasElement, 6);
    validateCellContent(canvasElement, 0, "id", "1");
    validateCellContent(canvasElement, 0, "user.name", "User 1");
    validateCellContent(canvasElement, 0, "user.email", "user1@example.com");
    const cityCell = canvasElement.querySelector(
      '[data-accessor="user.profile.city"]'
    );
    expect(cityCell).toBeTruthy();
    const countryCell = canvasElement.querySelector(
      '[data-accessor="user.profile.country"]'
    );
    expect(countryCell).toBeTruthy();
  },
};

// ============================================================================
// TEST 7: ARRAY INDEX ACCESSORS (v1.9.4+)
// ============================================================================

export const ArrayIndexAccessors = {
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
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      height: "400px",
    });
    h2.textContent = "Array Index Accessors (v1.9.4+)";
    const p = document.createElement("p");
    p.style.marginBottom = "1rem";
    p.style.color = "#666";
    p.textContent =
      "Accessing array elements: awards[0], albums[0].title, albums[1].year";
    wrapper.insertBefore(p, wrapper.querySelector("div:last-child"));
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await validateBasicTableStructure(canvasElement);
    validateColumnCount(canvasElement, 7);
    validateCellContent(canvasElement, 0, "id", "1");
    validateCellContent(canvasElement, 0, "name", "Artist 1");
    const firstAwardCell = canvasElement.querySelector(
      '[data-accessor="awards[0]"]'
    );
    expect(firstAwardCell).toBeTruthy();
    const albumTitleCell = canvasElement.querySelector(
      '[data-accessor="albums[0].title"]'
    );
    expect(albumTitleCell).toBeTruthy();
  },
};

// ============================================================================
// TEST 8: COLUMN WIDTH CONFIGURATIONS
// ============================================================================

export const ColumnWidthConfigurations = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "Fixed 80px", width: 80 },
      { accessor: "name", label: "Fixed 200px", width: 200 },
      { accessor: "email", label: "Flexible 1fr", width: "1fr" },
      { accessor: "age", label: "Fixed 100px", width: 100 },
      { accessor: "isActive", label: "Fixed 120px", width: 120, type: "boolean" },
    ];
    const data = createBasicData(15);
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      height: "400px",
    });
    h2.textContent = "Column Width Configurations";
    const p = document.createElement("p");
    p.style.marginBottom = "1rem";
    p.style.color = "#666";
    p.textContent =
      "Mix of fixed pixel widths (80px, 200px, 100px) and flexible width (1fr)";
    wrapper.insertBefore(p, wrapper.querySelector("div:last-child"));
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await validateBasicTableStructure(canvasElement);
    validateColumnCount(canvasElement, 5);
    // Column widths are normalized to px (fr/% converted at init). Assert header cell widths.
    const getHeaderWidth = (accessor: string): number => {
      const cell = canvasElement.querySelector(
        `.st-header-cell[data-accessor="${accessor}"]`
      ) as HTMLElement;
      if (!cell) throw new Error(`Header cell not found: ${accessor}`);
      const w = cell.style.width;
      return w ? parseFloat(w) : (cell.offsetWidth ?? 0);
    };
    expect(getHeaderWidth("id")).toBe(80);
    expect(getHeaderWidth("name")).toBe(200);
    expect(getHeaderWidth("age")).toBe(100);
    expect(getHeaderWidth("isActive")).toBe(120);
    // email was "1fr" → fills remaining space (container width minus fixed columns)
    const emailWidth = getHeaderWidth("email");
    expect(emailWidth).toBeGreaterThanOrEqual(100);
  },
};

// ============================================================================
// TEST 9: DATA TYPES RENDERING
// ============================================================================

export const DataTypesRendering = {
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
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      height: "400px",
    });
    h2.textContent = "Data Types Rendering";
    const p = document.createElement("p");
    p.style.marginBottom = "1rem";
    p.style.color = "#666";
    p.textContent =
      "Testing different data types: string, number, boolean, date";
    wrapper.insertBefore(p, wrapper.querySelector("div:last-child"));
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await validateBasicTableStructure(canvasElement);
    validateColumnCount(canvasElement, 6);
    validateCellContent(canvasElement, 0, "id", "1");
    validateCellContent(canvasElement, 0, "name", "User 1");
    validateCellContent(canvasElement, 0, "age", "20");
    const booleanCell = canvasElement.querySelector(
      '[data-accessor="isActive"]'
    );
    expect(booleanCell).toBeTruthy();
    const dateCell = canvasElement.querySelector(
      '[data-accessor="joinDate"]'
    );
    expect(dateCell).toBeTruthy();
  },
};

// ============================================================================
// TEST 10: VIEWPORT RELATIVE HEIGHT
// ============================================================================

export const ViewportRelativeHeight = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
    ];
    const data = createBasicData(50);
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      height: "50vh",
    });
    h2.textContent = "Viewport Relative Height (50vh)";
    const p = document.createElement("p");
    p.style.marginBottom = "1rem";
    p.style.color = "#666";
    p.textContent = "Table height is 50% of viewport height";
    wrapper.insertBefore(p, wrapper.querySelector("div:last-child"));
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await validateBasicTableStructure(canvasElement);
    const tableRoot = canvasElement.querySelector(".simple-table-root");
    if (!tableRoot) throw new Error("Table root not found");
    expect(tableRoot).toBeTruthy();
    const hasHeightSet =
      tableRoot.style.height === "50vh" ||
      tableRoot.style.cssText.includes("height: 50vh");
    expect(hasHeightSet).toBe(true);
  },
};

// ============================================================================
// TEST 11: COMPREHENSIVE STRUCTURE VALIDATION
// ============================================================================

export const ComprehensiveStructureValidation = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "age", label: "Age", width: 100 },
      { accessor: "email", label: "Email", width: 250 },
    ];
    const data = createBasicData(25);
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      height: "500px",
      getRowId: ({ row }) => String(row.id),
    });
    h2.textContent = "Comprehensive DOM Structure Validation";
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await validateBasicTableStructure(canvasElement);
    const tableRoot = canvasElement.querySelector(".simple-table-root");
    if (!tableRoot) throw new Error("Table root not found");
    expect(tableRoot).toBeTruthy();
    const headerContainer = canvasElement.querySelector(".st-header-container");
    if (!headerContainer) throw new Error("Header container not found");
    const headerMain = headerContainer.querySelector(".st-header-main");
    if (!headerMain) throw new Error("Header main not found");
    expect(headerMain).toBeTruthy();
    const headerCells = canvasElement.querySelectorAll(".st-header-cell");
    expect(headerCells.length).toBe(4);
    headerCells.forEach((cell) => {
      const labelText = cell.querySelector(".st-header-label-text");
      expect(labelText).toBeTruthy();
      expect(labelText?.textContent).toBeTruthy();
    });
    const bodyContainer = canvasElement.querySelector(".st-body-container");
    if (!bodyContainer) throw new Error("Body container not found");
    const bodyMain = bodyContainer.querySelector(".st-body-main");
    if (!bodyMain) throw new Error("Body main not found");
    expect(bodyMain).toBeTruthy();
    const cells: NodeListOf<Element> = bodyContainer.querySelectorAll(".st-cell");
    expect(cells.length).toBeGreaterThan(0);
    const uniqueRowIndices = new Set(
      (Array.from(cells) ).map((cell) =>
        cell.getAttribute("data-row-index")
      )
    );
    expect(uniqueRowIndices.size).toBeGreaterThan(0);
    validateCellContent(canvasElement, 0, "id", "1");
    validateCellContent(canvasElement, 0, "name", "User 1");
    const firstCell = canvasElement.querySelector(".st-cell");
    if (!firstCell) throw new Error("First cell not found");
    expect(firstCell).toBeTruthy();
    const cellContent = firstCell.querySelector(".st-cell-content");
    if (!cellContent) throw new Error("Cell content not found");
    expect(cellContent).toBeTruthy();
  },
};