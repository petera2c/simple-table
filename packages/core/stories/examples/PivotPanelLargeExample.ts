/**
 * Large deterministic dataset for Pivot Panel DOM interaction tests.
 * Full cartesian: 4×5×2×4×3 → 480 source rows × 10 columns.
 */
import type { ColumnDef, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

export const LARGE_REGIONS = ["East", "North", "South", "West"] as const;
export const LARGE_PRODUCTS = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"] as const;
export const LARGE_YEARS = ["2024", "2025"] as const;
export const LARGE_QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;
export const LARGE_CHANNELS = ["Direct", "Online", "Partner"] as const;

export const LARGE_PIVOT_HEADERS: ColumnDef[] = [
  { accessor: "region", label: "Region", width: 110, type: "string", sortable: true },
  { accessor: "product", label: "Product", width: 110, type: "string", sortable: true },
  { accessor: "year", label: "Year", width: 90, type: "string", sortable: true },
  { accessor: "quarter", label: "Quarter", width: 90, type: "string", sortable: true },
  { accessor: "channel", label: "Channel", width: 100, type: "string", sortable: true },
  {
    accessor: "sales",
    label: "Sales",
    width: 100,
    type: "number",
    align: "right",
    sortable: true,
    valueFormatter: ({ value }) => (typeof value === "number" ? `$${value.toLocaleString()}` : ""),
  },
  {
    accessor: "units",
    label: "Units",
    width: 90,
    type: "number",
    align: "right",
    sortable: true,
  },
  {
    accessor: "cost",
    label: "Cost",
    width: 100,
    type: "number",
    align: "right",
    sortable: true,
    valueFormatter: ({ value }) => (typeof value === "number" ? `$${value.toLocaleString()}` : ""),
  },
  {
    accessor: "margin",
    label: "Margin",
    width: 90,
    type: "number",
    align: "right",
    sortable: true,
  },
  {
    accessor: "returns",
    label: "Returns",
    width: 90,
    type: "number",
    align: "right",
    sortable: true,
  },
];

/** Constant measures keep expected pivot aggregates easy to verify in DOM. */
export function buildLargePivotPanelRows(): Row[] {
  const rows: Row[] = [];
  let id = 1;
  for (const region of LARGE_REGIONS) {
    for (const product of LARGE_PRODUCTS) {
      for (const year of LARGE_YEARS) {
        for (const quarter of LARGE_QUARTERS) {
          for (const channel of LARGE_CHANNELS) {
            rows.push({
              id,
              region,
              product,
              year,
              quarter,
              channel,
              sales: 10,
              units: 2,
              cost: 5,
              margin: 3,
              returns: 1,
            });
            id++;
          }
        }
      }
    }
  }
  return rows;
}

export const LARGE_PIVOT_ROWS = buildLargePivotPanelRows();

export const pivotPanelLargeDefaults = {
  columnResizing: true,
  enableColumnEditor: true,
  enableColumnEditorInitOpen: true,
  enablePivotPanel: true,
  // Render every row/column so DOM assertions can inspect the full matrix.
  enableVirtualization: false,
  columnBorders: true,
  height: "640px",
};

export function formatSalesDom(value: number): string {
  return `$${value.toLocaleString()}`;
}

export function sumMeasure(
  rows: Row[],
  measure: string,
  filters: Record<string, string>
): number {
  return rows.reduce((sum, row) => {
    for (const [key, expected] of Object.entries(filters)) {
      if (String(row[key as keyof Row]) !== expected) return sum;
    }
    const value = row[measure as keyof Row];
    return sum + (typeof value === "number" ? value : 0);
  }, 0);
}

export function renderPivotPanelLargeExample(
  args?: Partial<UniversalVanillaArgs>
): HTMLElement {
  const options = {
    ...defaultVanillaArgs,
    ...pivotPanelLargeDefaults,
    ...args,
    enableVirtualization: args?.enableVirtualization ?? pivotPanelLargeDefaults.enableVirtualization,
  };
  const { wrapper, h2 } = renderVanillaTable(LARGE_PIVOT_HEADERS, LARGE_PIVOT_ROWS, {
    ...options,
    // Pivot aggregate rows have no `id` — return undefined so the table uses
    // reference identity (String(row.id) would collapse every pivot row to "undefined").
    getRowId: ({ row }) => (row?.id == null ? undefined : String(row.id)),
  });
  h2.textContent = "Pivot Panel — Large Grid";
  return wrapper;
}
