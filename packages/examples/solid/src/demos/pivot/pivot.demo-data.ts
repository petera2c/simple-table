import type { PivotConfig, SolidHeaderObject, Row } from "@simple-table/solid";

export const pivotHeaders: SolidHeaderObject[] = [
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

const REGIONS = ["West", "East", "North", "South"] as const;
const COUNTRIES: Record<(typeof REGIONS)[number], string[]> = {
  West: ["USA", "Canada"],
  East: ["USA", "UK"],
  North: ["Canada", "Sweden"],
  South: ["Brazil", "Australia"],
};
const CATEGORIES = ["Hardware", "Software"] as const;
const PRODUCTS: Record<(typeof CATEGORIES)[number], string[]> = {
  Hardware: ["Widget", "Gadget", "Sensor"],
  Software: ["License", "Subscription"],
};
const CHANNELS = ["Direct", "Partner", "Online"] as const;
const YEARS = [2024, 2025] as const;
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;

/** Sparse multi-dimension fact cube (~150–250 rows). */
export function generatePivotRows(): Row[] {
  const rows: Row[] = [];
  let id = 1;
  for (const region of REGIONS) {
    for (const country of COUNTRIES[region]) {
      for (const category of CATEGORIES) {
        for (const product of PRODUCTS[category]) {
          for (const channel of CHANNELS) {
            for (const year of YEARS) {
              for (const quarter of QUARTERS) {
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

export const pivotRows: Row[] = generatePivotRows();

export type PivotPreset = {
  id: string;
  label: string;
  pivot: PivotConfig;
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
    id: "nested-rows",
    label: "Region → Product",
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

export const pivotConfig: PivotConfig = pivotPresets[0].pivot;

export const pivotDemoConfig = {
  headers: pivotHeaders,
  rows: pivotRows,
  tableProps: { pivot: pivotConfig },
  presets: pivotPresets,
};
