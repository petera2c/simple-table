/**
 * PivotPanelExample – scaffold for the in-table Pivot Panel feature.
 */
import type { ColumnDef, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

const HEADERS: ColumnDef[] = [
  { accessor: "region", label: "Region", width: 120, type: "string", sortable: true },
  { accessor: "product", label: "Product", width: 120, type: "string", sortable: true },
  { accessor: "quarter", label: "Quarter", width: 100, type: "string", sortable: true },
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
];

const REGIONS = ["West", "East", "North", "South"] as const;
const PRODUCTS = ["Widget", "Gadget", "License"] as const;
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;

const ROWS: Row[] = (() => {
  const rows: Row[] = [];
  let id = 1;
  for (const region of REGIONS) {
    for (const product of PRODUCTS) {
      for (const quarter of QUARTERS) {
        const base = 40 + ((id * 17) % 90);
        rows.push({
          id,
          region,
          product,
          quarter,
          sales: base * 100,
          units: base,
        });
        id++;
      }
    }
  }
  return rows;
})();

export const pivotPanelExampleDefaults = {
  autoExpandColumns: true,
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  enableColumnEditor: true,
  enableColumnEditorInitOpen: true,
  enablePivotPanel: true,
  columnBorders: true,
  height: "480px",
};

export function renderPivotPanelExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...pivotPanelExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    ...options,
    // Pivot aggregate rows have no `id` — return undefined so the table uses
    // reference identity (String(row.id) would collapse every pivot row to "undefined").
    getRowId: ({ row }) => (row?.id == null ? undefined : String(row.id)),
  });
  h2.textContent = "Pivot Panel";
  return wrapper;
}
