import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { PivotConfig, ReactColumnDef, Row, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

const headers: ReactColumnDef[] = [
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
    valueFormatter: ({ value }: { value: unknown }) =>
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
    valueFormatter: ({ value }: { value: unknown }) =>
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

function generatePivotRows(): Row[] {
  const next: Row[] = [];
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
                next.push({
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
  return next;
}

const rows: Row[] = generatePivotRows();

type Preset = {
  id: string;
  label: string;
  pivot: PivotConfig;
};

const PRESETS: Preset[] = [
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

const PivotDemo = ({
  height = "auto",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [activeId, setActiveId] = useState(PRESETS[0].id);
  const active = PRESETS.find((p) => p.id === activeId) ?? PRESETS[0];
  const nestedRows = active.pivot.rows.length > 1;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const selected = preset.id === activeId;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => setActiveId(preset.id)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                selected
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 m-0">
        {rows.length} fact rows · Active:{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
          rows: [{active.pivot.rows.map((r: string) => `"${r}"`).join(", ")}]
        </code>{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
          columns: [{active.pivot.columns.map((c: string) => `"${c}"`).join(", ")}]
        </code>
      </p>
      <SimpleTable
        columns={headers}
        rows={rows}
        columnResizing
        expandAll={nestedRows}
        height={height}
        pivot={active.pivot}
        selectableCells
        theme={theme}
      />
    </div>
  );
};

export default PivotDemo;
