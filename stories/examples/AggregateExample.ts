/**
 * AggregateExample – vanilla port of React AggregateExample.
 * Same headers, data, and props as React version.
 */
import type { HeaderObject } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import { AGGREGATE_ROWS } from "../data/aggregate-data";

const HEADERS: HeaderObject[] = [
  { accessor: "name", label: "Name", width: 200, expandable: true, type: "string" },
  {
    accessor: "followers",
    label: "Followers",
    width: 120,
    type: "number",
    aggregation: { type: "sum" },
    valueFormatter: ({ value }: { value?: unknown }) => {
      if (typeof value === "number") {
        return value >= 1000000
          ? `${(value / 1000000).toFixed(1)}M`
          : value >= 1000
            ? `${(value / 1000).toFixed(0)}K`
            : String(value);
      }
      return "";
    },
  },
  {
    accessor: "revenue",
    label: "Monthly Revenue",
    width: 140,
    type: "string",
    aggregation: {
      type: "sum",
      parseValue: (value: string) => {
        const n = parseFloat(String(value).replace(/[$K]/g, ""));
        return isNaN(n) ? 0 : n;
      },
    },
    cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
      const value = row.revenue;
      if (typeof value === "number") return `$${value.toFixed(1)}K`;
      if (typeof value === "string") return value;
      return "";
    },
  },
  {
    accessor: "rating",
    label: "Rating",
    width: 100,
    type: "number",
    aggregation: { type: "average" },
    valueFormatter: ({ value }: { value?: unknown }) =>
      typeof value === "number" ? `${value.toFixed(1)} ⭐` : "",
  },
  { accessor: "contentCount", label: "Content", width: 90, type: "number", aggregation: { type: "sum" } },
  {
    accessor: "avgViewTime",
    label: "Avg Watch Time",
    width: 130,
    type: "number",
    aggregation: { type: "average" },
    valueFormatter: ({ value }: { value?: unknown }) =>
      typeof value === "number" ? `${Math.round(value)}min` : "",
  },
  { accessor: "status", label: "Status", width: 120, type: "string" },
];

export const aggregateExampleDefaults = {
  columnResizing: true,
  height: "400px",
  rowGrouping: ["categories", "creators"] as const,
};

export function renderAggregateExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...aggregateExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(HEADERS, AGGREGATE_ROWS, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Aggregate";
  return wrapper;
}
