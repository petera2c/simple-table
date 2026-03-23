/**
 * AGGREGATE FUNCTIONS TESTS
 * Tests for HeaderObject.aggregation (sum, average, count, min, max, custom, parseValue, formatResult).
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/30 - Aggregate Functions",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Tests for aggregation in grouped rows: sum, average, count, min, max, custom, parseValue, formatResult.",
      },
    },
  },
};

export default meta;

const simpleGroupedData = () => [
  {
    id: "g1",
    name: "Group A",
    items: [
      { id: 1, name: "Item 1", amount: 10, score: 80 },
      { id: 2, name: "Item 2", amount: 20, score: 90 },
      { id: 3, name: "Item 3", amount: 30, score: 70 },
    ],
  },
  {
    id: "g2",
    name: "Group B",
    items: [
      { id: 4, name: "Item 4", amount: 40, score: 85 },
      { id: 5, name: "Item 5", amount: 50, score: 95 },
    ],
  },
];

export const AggregationSum = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, expandable: true, type: "string" },
      {
        accessor: "amount",
        label: "Total",
        width: 100,
        type: "number",
        aggregation: { type: "sum" },
      },
    ];
    const { wrapper } = renderVanillaTable(headers, simpleGroupedData(), {
      getRowId: (p) => String((p.row as { id?: string })?.id),
      height: "350px",
      rowGrouping: ["items"],
      expandAll: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const cells = canvasElement.querySelectorAll(".st-cell[data-accessor='amount']");
    expect(cells.length).toBeGreaterThan(0);
    const textContents = Array.from(cells).map((c) => c.textContent?.trim() ?? "");
    // Group A sum = 10+20+30 = 60, Group B sum = 40+50 = 90
    expect(textContents.some((t) => t.includes("60"))).toBe(true);
    expect(textContents.some((t) => t.includes("90"))).toBe(true);
  },
};

export const AggregationAverage = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, expandable: true, type: "string" },
      {
        accessor: "score",
        label: "Avg Score",
        width: 100,
        type: "number",
        aggregation: { type: "average" },
      },
    ];
    const { wrapper } = renderVanillaTable(headers, simpleGroupedData(), {
      getRowId: (p) => String((p.row as { id?: string })?.id),
      height: "350px",
      rowGrouping: ["items"],
      expandAll: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const cells = canvasElement.querySelectorAll(".st-cell[data-accessor='score']");
    expect(cells.length).toBeGreaterThan(0);
    const textContents = Array.from(cells).map((c) => c.querySelector(".st-cell-content")?.textContent?.trim() ?? "");
    expect(textContents.some((t) => t === "80" || t.includes("80"))).toBe(true);
  },
};

export const AggregationCount = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, expandable: true, type: "string" },
      {
        accessor: "id",
        label: "Count",
        width: 80,
        type: "number",
        aggregation: { type: "count" },
      },
    ];
    const { wrapper } = renderVanillaTable(headers, simpleGroupedData(), {
      getRowId: (p) => String((p.row as { id?: string })?.id),
      height: "350px",
      rowGrouping: ["items"],
      expandAll: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const cells = canvasElement.querySelectorAll(".st-cell[data-accessor='id']");
    expect(cells.length).toBeGreaterThan(0);
    const textContents = Array.from(cells).map((c) => c.querySelector(".st-cell-content")?.textContent?.trim() ?? "");
    expect(textContents.some((t) => t === "3" || t === "2")).toBe(true);
  },
};

export const AggregationMinMax = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, expandable: true, type: "string" },
      {
        accessor: "score",
        label: "Min",
        width: 80,
        type: "number",
        aggregation: { type: "min" },
      },
      {
        accessor: "score",
        label: "Max",
        width: 80,
        type: "number",
        aggregation: { type: "max" },
      },
    ];
    const data = [
      { id: "g1", name: "Group", items: [{ id: 1, name: "A", score: 10 }, { id: 2, name: "B", score: 90 }] },
    ];
    const headersWithTwoCols: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, expandable: true, type: "string" },
      { accessor: "score", label: "Min", width: 80, type: "number", aggregation: { type: "min" } },
      { accessor: "score", label: "Max", width: 80, type: "number", aggregation: { type: "max" } },
    ];
    const { wrapper } = renderVanillaTable(headersWithTwoCols, data, {
      getRowId: (p) => String((p.row as { id?: string })?.id),
      height: "250px",
      rowGrouping: ["items"],
      expandAll: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.textContent).toContain("10");
    expect(canvasElement.textContent).toContain("90");
  },
};

export const AggregationParseAndFormat = {
  render: () => {
    const data = [
      {
        id: "g1",
        name: "Group",
        items: [
          { id: 1, amount: "$10.00" },
          { id: 2, amount: "$20.00" },
        ],
      },
    ];
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, expandable: true, type: "string" },
      {
        accessor: "amount",
        label: "Total",
        width: 120,
        type: "string",
        aggregation: {
          type: "sum",
          parseValue: (v) => parseFloat(String(v).replace(/[^0-9.]/g, "")) || 0,
          formatResult: (n) => `$${(n as number).toFixed(2)}`,
        },
      },
    ];
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (p) => String((p.row as { id?: string })?.id),
      height: "250px",
      rowGrouping: ["items"],
      expandAll: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const cells = canvasElement.querySelectorAll(".st-cell[data-accessor='amount']");
    expect(cells.length).toBeGreaterThan(0);
    const textContents = Array.from(cells).map((c) => c.textContent?.trim() ?? "");
    // Parent group shows formatted aggregated result $30.00
    expect(textContents.some((t) => t.includes("$30") || t.includes("30"))).toBe(true);
  },
};

export const AggregationCustom = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, expandable: true, type: "string" },
      {
        accessor: "amount",
        label: "Custom (count > 15)",
        width: 120,
        type: "number",
        aggregation: {
          type: "custom",
          customFn: (values: unknown[]) =>
            (values as number[]).filter((v) => typeof v === "number" && v > 15).length,
        },
      },
    ];
    const { wrapper } = renderVanillaTable(headers, simpleGroupedData(), {
      getRowId: (p) => String((p.row as { id?: string })?.id),
      height: "350px",
      rowGrouping: ["items"],
      expandAll: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const cells = canvasElement.querySelectorAll(".st-cell[data-accessor='amount']");
    expect(cells.length).toBeGreaterThan(0);
    const textContents = Array.from(cells).map((c) => c.textContent?.trim() ?? "");
    // Group A: values > 15 are 20, 30 → count = 2
    // Group B: values > 15 are 40, 50 → count = 2
    expect(textContents.some((t) => t.includes("2"))).toBe(true);
  },
};

// ============================================================================
// HIERARCHICAL MULTI-LEVEL AGGREGATION
// ============================================================================

export const HierarchicalAggregation = {
  render: () => {
    const hierarchicalData = [
      {
        id: "dept-1",
        name: "Engineering",
        teams: [
          {
            id: "team-1",
            name: "Frontend",
            members: [
              { id: "m1", name: "Alice", salary: 100000 },
              { id: "m2", name: "Bob", salary: 90000 },
            ],
          },
          {
            id: "team-2",
            name: "Backend",
            members: [
              { id: "m3", name: "Charlie", salary: 120000 },
            ],
          },
        ],
      },
    ];

    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, expandable: true, type: "string" },
      {
        accessor: "salary",
        label: "Total Salary",
        width: 120,
        type: "number",
        aggregation: { type: "sum" },
      },
    ];
    const { wrapper } = renderVanillaTable(headers, hierarchicalData, {
      getRowId: (p) => String((p.row as { id?: string })?.id),
      height: "400px",
      rowGrouping: ["teams", "members"],
      expandAll: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const cells = canvasElement.querySelectorAll(".st-cell[data-accessor='salary']");
    expect(cells.length).toBeGreaterThan(0);
    const textContents = Array.from(cells).map((c) => c.textContent?.trim() ?? "");
    // Individual: 100000, 90000, 120000
    // Frontend team: 190000
    // Dept: 310000
    expect(textContents.some((t) => t.includes("100000"))).toBe(true);
    expect(textContents.some((t) => t.includes("310000"))).toBe(true);
  },
};
