/**
 * NESTED TABLES TESTS
 * Ported from React - same tests, vanilla table only.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import type { HeaderObject, Row } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/17 - Nested Tables",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Comprehensive tests for nested/expandable tables and nested table rendering.",
      },
    },
  },
};

export default meta;

const createCompanyData = () => [
  {
    id: 1,
    companyName: "Tech Corp",
    industry: "Technology",
    revenue: 5000000,
    divisions: [
      { id: 101, divisionName: "Software", location: "San Francisco", headcount: 150, budget: 2000000 },
      { id: 102, divisionName: "Hardware", location: "Austin", headcount: 100, budget: 1500000 },
    ],
  },
  {
    id: 2,
    companyName: "Finance Inc",
    industry: "Finance",
    revenue: 3000000,
    divisions: [
      { id: 201, divisionName: "Investment", location: "New York", headcount: 80, budget: 1200000 },
    ],
  },
];

const getExpandButtons = (canvasElement: HTMLElement): HTMLElement[] =>
  Array.from(canvasElement.querySelectorAll(".st-expand-icon-container:not(.placeholder)")) as HTMLElement[];

const getNestedTables = (canvasElement: HTMLElement): Element[] =>
  Array.from(canvasElement.querySelectorAll(".st-nested-grid-row"));

export const BasicNestedTable = {
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
        nestedTable: { defaultHeaders: divisionHeaders },
      },
      { accessor: "industry", label: "Industry", width: 150, type: "string" },
      { accessor: "revenue", label: "Revenue", width: 150, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, data as Row[], {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "500px",
      rowGrouping: ["divisions"],
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const buttons = getExpandButtons(canvasElement);
    expect(buttons.length).toBeGreaterThan(0);
    buttons[0].click();
    await new Promise((r) => setTimeout(r, 500));
    const nested = getNestedTables(canvasElement);
    expect(nested.length).toBeGreaterThan(0);
  },
};

export const NestedTableWithIndependentColumns = {
  render: () => {
    const data = createCompanyData();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "divisionName", label: "Division", width: 180, type: "string" },
      { accessor: "headcount", label: "Headcount", width: 100, type: "number" },
    ];
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        type: "string",
        expandable: true,
        nestedTable: { defaultHeaders: divisionHeaders },
      },
      { accessor: "revenue", label: "Revenue", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, data as Row[], {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      rowGrouping: ["divisions"],
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const buttons = getExpandButtons(canvasElement);
    expect(buttons.length).toBeGreaterThan(0);
    expect(canvasElement.querySelector(".simple-table-root")).toBeTruthy();
  },
};

// ============================================================================
// NESTED TABLE WITH COLUMN RESIZING
// ============================================================================

export const NestedTableWithColumnResizing = {
  render: () => {
    const data = createCompanyData();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "divisionName", label: "Division", width: 180, type: "string" },
      { accessor: "headcount", label: "Headcount", width: 100, type: "number" },
      { accessor: "budget", label: "Budget", width: 120, type: "number" },
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
          columnResizing: true,
        },
      },
      { accessor: "revenue", label: "Revenue", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, data as Row[], {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "500px",
      rowGrouping: ["divisions"],
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const buttons = getExpandButtons(canvasElement);
    expect(buttons.length).toBeGreaterThan(0);
    buttons[0].click();
    await new Promise((r) => setTimeout(r, 500));
    const nested = getNestedTables(canvasElement);
    expect(nested.length).toBeGreaterThan(0);
    const nestedResizeHandles = nested[0].querySelectorAll(".st-header-resize-handle");
    expect(nestedResizeHandles.length).toBeGreaterThan(0);
  },
};

// ============================================================================
// NESTED TABLE WITH PAGINATION
// ============================================================================

export const NestedTableWithPagination = {
  render: () => {
    const data = createCompanyData();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "divisionName", label: "Division", width: 180, type: "string" },
      { accessor: "headcount", label: "Headcount", width: 100, type: "number" },
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
          shouldPaginate: true,
          rowsPerPage: 1,
        },
      },
      { accessor: "revenue", label: "Revenue", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, data as Row[], {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "500px",
      rowGrouping: ["divisions"],
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const buttons = getExpandButtons(canvasElement);
    expect(buttons.length).toBeGreaterThan(0);
    buttons[0].click();
    await new Promise((r) => setTimeout(r, 500));
    const nested = getNestedTables(canvasElement);
    expect(nested.length).toBeGreaterThan(0);
    // Pagination footer should appear in nested table
    const nestedFooter = nested[0].querySelector(".st-footer");
    expect(nestedFooter).toBeTruthy();
  },
};

// ============================================================================
// NESTED TABLE WITH FILTERING
// ============================================================================

export const NestedTableWithFiltering = {
  render: () => {
    const data = createCompanyData();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "divisionName", label: "Division", width: 180, type: "string", filterable: true },
      { accessor: "headcount", label: "Headcount", width: 100, type: "number" },
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
      { accessor: "revenue", label: "Revenue", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, data as Row[], {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "500px",
      rowGrouping: ["divisions"],
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const buttons = getExpandButtons(canvasElement);
    expect(buttons.length).toBeGreaterThan(0);
    buttons[0].click();
    await new Promise((r) => setTimeout(r, 500));
    const nested = getNestedTables(canvasElement);
    expect(nested.length).toBeGreaterThan(0);
    // Filter icon should appear in nested table header
    const filterIcons = nested[0].querySelectorAll(".st-icon-container");
    expect(filterIcons.length).toBeGreaterThan(0);
  },
};
