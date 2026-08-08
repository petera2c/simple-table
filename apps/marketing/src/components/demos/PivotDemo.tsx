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

const INITIAL_PIVOT: PivotConfig = {
  rows: ["region"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
};

const PivotDemo = ({
  height = "500px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [pivot, setPivot] = useState<PivotConfig | null>(INITIAL_PIVOT);

  return (
    <SimpleTable
      columns={headers}
      rows={rows}
      columnResizing
      enableColumnEditor
      enableColumnEditorInitOpen
      enablePivotPanel
      height={height}
      pivot={pivot}
      onPivotChange={setPivot}
      selectableCells
      theme={theme}
      getRowId={({ row }) => (row?.id == null ? undefined : String(row.id))}
    />
  );
};

export default PivotDemo;
