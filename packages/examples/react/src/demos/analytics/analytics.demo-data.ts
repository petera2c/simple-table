import type { PivotConfig, ReactHeaderObject, Row } from "@simple-table/react";

export const analyticsHeaders: ReactHeaderObject[] = [
  {
    accessor: "region",
    label: "Region",
    width: 110,
    type: "string",
    isSortable: true,
    filterable: true,
    tooltip: "Geographic sales region",
  },
  {
    accessor: "country",
    label: "Country",
    width: 100,
    type: "string",
    isSortable: true,
    filterable: true,
    tooltip: "Country within the region",
  },
  {
    accessor: "category",
    label: "Category",
    width: 110,
    type: "string",
    isSortable: true,
    filterable: true,
    tooltip: "Product category",
  },
  {
    accessor: "product",
    label: "Product",
    width: 120,
    type: "string",
    isSortable: true,
    filterable: true,
    tooltip: "SKU / product name",
  },
  {
    accessor: "channel",
    label: "Channel",
    width: 100,
    type: "string",
    isSortable: true,
    filterable: true,
    tooltip: "Go-to-market channel",
  },
  {
    accessor: "year",
    label: "Year",
    width: 80,
    type: "number",
    isSortable: true,
    filterable: true,
    tooltip: "Fiscal year",
  },
  {
    accessor: "quarter",
    label: "Quarter",
    width: 80,
    type: "string",
    isSortable: true,
    filterable: true,
    tooltip: "Fiscal quarter",
  },
  {
    accessor: "sales",
    label: "Sales",
    width: 100,
    type: "number",
    align: "right",
    isSortable: true,
    filterable: true,
    tooltip: "Gross sales revenue",
    valueFormatter: ({ value }) =>
      typeof value === "number" ? `$${value.toLocaleString()}` : "",
  },
  {
    accessor: "units",
    label: "Units",
    width: 80,
    type: "number",
    align: "right",
    isSortable: true,
    filterable: true,
    tooltip: "Units sold",
  },
  {
    accessor: "cost",
    label: "Cost",
    width: 100,
    type: "number",
    align: "right",
    isSortable: true,
    filterable: true,
    tooltip: "Cost of goods sold",
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
export function generateAnalyticsRows(): Row[] {
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

export const analyticsRows: Row[] = generateAnalyticsRows();

export type AnalyticsPreset = {
  id: string;
  label: string;
  description: string;
  /** `null` shows the flat fact table before any pivot is applied. */
  pivot: PivotConfig | null;
};

export const analyticsPresets: AnalyticsPreset[] = [
  {
    id: "source-data",
    label: "Source data",
    description: "Flat fact rows — pick a pivot view to reshape this data",
    pivot: null,
  },
  {
    id: "region-quarter",
    label: "Region × Quarter",
    description: "Same rows, pivoted: sales totals by region across quarters",
    pivot: {
      rows: ["region"],
      columns: ["quarter"],
      values: [{ accessor: "sales", aggregation: { type: "sum" } }],
    },
  },
  {
    id: "nested-rows",
    label: "Region → Product",
    description: "Drill into products within each region",
    pivot: {
      rows: ["region", "product"],
      columns: ["quarter"],
      values: [{ accessor: "sales", aggregation: { type: "sum" } }],
    },
  },
  {
    id: "category-year-quarter",
    label: "Category × Year → Quarter",
    description: "Nested column headers for year and quarter",
    pivot: {
      rows: ["category"],
      columns: ["year", "quarter"],
      values: [{ accessor: "sales", aggregation: { type: "sum" } }],
    },
  },
  {
    id: "channel-quarter",
    label: "Channel × Quarter",
    description: "Sales and units by go-to-market channel",
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
    description: "Average sales across countries and categories",
    pivot: {
      rows: ["country"],
      columns: ["category"],
      values: [{ accessor: "sales", aggregation: { type: "average" } }],
      showColumnTotals: false,
    },
  },
];

export const analyticsConfig: PivotConfig | null = analyticsPresets[0].pivot;

export const analyticsDemoConfig = {
  headers: analyticsHeaders,
  rows: analyticsRows,
  tableProps: { pivot: analyticsConfig },
  presets: analyticsPresets,
};
