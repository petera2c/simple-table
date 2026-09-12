import type { PivotConfig, ReactColumnDef } from "@simple-table/react";

export interface PivotFact {
  id: string;
  region: string;
  country: string;
  category: string;
  product: string;
  channel: string;
  year: number;
  quarter: string;
  sales: number;
  units: number;
  cost: number;
}

export const pivotHeaders: ReactColumnDef<PivotFact>[] = [
  { accessor: "region", label: "Region", width: 110, type: "string" },
  { accessor: "country", label: "Country", width: 100, type: "string" },
  { accessor: "category", label: "Category", width: 110, type: "string" },
  { accessor: "product", label: "Product", width: 120, type: "string" },
  { accessor: "channel", label: "Channel", width: 100, type: "string" },
  { accessor: "year", label: "Year", width: 80, type: "number" },
  { accessor: "quarter", label: "Quarter", width: 80, type: "string" },
  {
    accessor: "sales",
    label: "Sales",
    width: 100,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) =>
      typeof value === "number" ? `$${value.toLocaleString()}` : "",
  },
  {
    accessor: "units",
    label: "Units",
    width: 80,
    type: "number",
    align: "right",
  },
  {
    accessor: "cost",
    label: "Cost",
    width: 100,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) =>
      typeof value === "number" ? `$${value.toLocaleString()}` : "",
  },
];

const COUNTRIES = {
  West: ["USA", "Canada"],
  East: ["USA", "UK"],
  North: ["Canada", "Sweden"],
  South: ["Brazil", "Australia"],
};
const PRODUCTS = {
  Hardware: ["Widget", "Gadget", "Sensor"],
  Software: ["License", "Subscription"],
};
const CHANNELS = ["Direct", "Partner", "Online"];
const YEARS = [2024, 2025];
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

/** Sparse multi-dimension fact cube (~150–250 rows). */
export function generatePivotRows(): PivotFact[] {
  const rows: PivotFact[] = [];
  let id = 1;
  for (const [region, countries] of Object.entries(COUNTRIES)) {
    for (const country of countries) {
      for (const [category, products] of Object.entries(PRODUCTS)) {
        for (const product of products) {
          for (const channel of CHANNELS) {
            for (const year of YEARS) {
              for (const quarter of QUARTERS) {
                // Sparse facts — skip ~1/3 of combinations
                if ((id + year + quarter.charCodeAt(1) + channel.length) % 5 !== 0) {
                  id++;
                  continue;
                }
                const base = 40 + ((id * 17) % 90);
                rows.push({
                  id: `r${id}`,
                  region,
                  country,
                  category,
                  product,
                  channel,
                  year,
                  quarter,
                  sales: base * 100,
                  units: base,
                  cost: Math.round(base * 55),
                });
                id++;
              }
            }
          }
        }
      }
    }
  }
  return rows;
}

export const pivotRows: PivotFact[] = generatePivotRows();

export type PivotPreset = {
  id: string;
  label: string;
  pivot: PivotConfig<PivotFact>;
};

export const pivotPresets: PivotPreset[] = [
  {
    id: "region-quarter",
    label: "Region × Quarter",
    pivot: {
      rows: ["region"],
      columns: ["quarter"],
      values: [{ accessor: "sales", aggregation: { type: "sum" } }],
    },
  },
  {
    id: "multi-rows",
    label: "Region × Product",
    pivot: {
      rows: ["region", "product"],
      columns: ["quarter"],
      values: [{ accessor: "sales", aggregation: { type: "sum" } }],
    },
  },
  {
    id: "category-year-quarter",
    label: "Category × Year → Quarter",
    pivot: {
      rows: ["category"],
      columns: ["year", "quarter"],
      values: [{ accessor: "sales", aggregation: { type: "sum" } }],
    },
  },
  {
    id: "channel-quarter",
    label: "Channel × Quarter",
    pivot: {
      rows: ["channel"],
      columns: ["quarter"],
      values: [
        { accessor: "sales", aggregation: { type: "sum" }, label: "Sales" },
        { accessor: "units", aggregation: { type: "sum" }, label: "Units" },
      ],
    },
  },
  {
    id: "country-category",
    label: "Country × Category",
    pivot: {
      rows: ["country"],
      columns: ["category"],
      values: [{ accessor: "sales", aggregation: { type: "average" } }],
      showColumnTotals: false,
    },
  },
  {
    id: "values-only",
    label: "Values only",
    pivot: {
      rows: ["region", "category"],
      columns: [],
      values: [
        { accessor: "sales", aggregation: { type: "sum" } },
        { accessor: "cost", aggregation: { type: "sum" } },
      ],
    },
  },
];

export const pivotConfig: PivotConfig<PivotFact> = pivotPresets[0].pivot;

export const pivotDemoConfig = {
  headers: pivotHeaders,
  rows: pivotRows,
  tableProps: { pivot: pivotConfig },
  presets: pivotPresets,
};
