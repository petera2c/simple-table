/**
 * AggregateExample – vanilla port of React AggregateExample.
 */
import { renderVanillaTable } from "../utils";

const HEADERS: Record<string, unknown>[] = [
  { accessor: "name", label: "Name", width: 200, expandable: true, type: "string" },
  { accessor: "followers", label: "Followers", width: 120, type: "number", aggregation: { type: "sum" } },
  { accessor: "revenue", label: "Monthly Revenue", width: 140, type: "string" },
  { accessor: "rating", label: "Rating", width: 100, type: "number", aggregation: { type: "average" } },
  { accessor: "contentCount", label: "Content", width: 90, type: "number", aggregation: { type: "sum" } },
];

const ROWS: Record<string, unknown>[] = [
  { id: 1, name: "StreamFlix", followers: 5000000, revenue: "$120K", rating: 4.8, contentCount: 1200 },
  { id: 2, name: "Creator A", followers: 2800000, revenue: "$45.2K", rating: 4.8, contentCount: 328 },
  { id: 3, name: "Creator B", followers: 1200000, revenue: "$28.5K", rating: 4.6, contentCount: 156 },
];

export function renderAggregateExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    columnResizing: true,
    height: "400px",
    rowGrouping: ["name"],
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Aggregate";
  return wrapper;
}
