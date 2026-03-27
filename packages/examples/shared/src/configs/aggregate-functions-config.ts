import type { HeaderObject } from "simple-table-core";

export const aggregateFunctionsData = [
  { id: 1, product: "Widget A", category: "Widgets", region: "North", revenue: 45000, units: 150 },
  { id: 2, product: "Widget B", category: "Widgets", region: "North", revenue: 32000, units: 110 },
  { id: 3, product: "Widget C", category: "Widgets", region: "South", revenue: 28000, units: 95 },
  { id: 4, product: "Gadget X", category: "Gadgets", region: "North", revenue: 67000, units: 200 },
  { id: 5, product: "Gadget Y", category: "Gadgets", region: "South", revenue: 55000, units: 180 },
  { id: 6, product: "Gadget Z", category: "Gadgets", region: "East", revenue: 41000, units: 130 },
  { id: 7, product: "Tool Alpha", category: "Tools", region: "North", revenue: 89000, units: 300 },
  { id: 8, product: "Tool Beta", category: "Tools", region: "South", revenue: 73000, units: 250 },
  { id: 9, product: "Tool Gamma", category: "Tools", region: "East", revenue: 61000, units: 210 },
  { id: 10, product: "Tool Delta", category: "Tools", region: "West", revenue: 52000, units: 175 },
  { id: 11, product: "Widget D", category: "Widgets", region: "East", revenue: 38000, units: 125 },
  { id: 12, product: "Gadget W", category: "Gadgets", region: "West", revenue: 49000, units: 160 },
];

export const aggregateFunctionsHeaders: HeaderObject[] = [
  { accessor: "product", label: "Product", width: "1fr", minWidth: 120 },
  { accessor: "category", label: "Category", width: 130 },
  { accessor: "region", label: "Region", width: 120 },
  {
    accessor: "revenue",
    label: "Revenue",
    width: 130,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
    aggregation: {
      type: "sum" as const,
      formatResult: (val: number) => `$${val.toLocaleString()}`,
    },
  },
  {
    accessor: "units",
    label: "Units Sold",
    width: 120,
    type: "number",
    align: "right",
    aggregation: {
      type: "sum" as const,
      formatResult: (val: number) => val.toLocaleString(),
    },
  },
];

export const aggregateFunctionsConfig = {
  headers: aggregateFunctionsHeaders,
  rows: aggregateFunctionsData,
  tableProps: {
    rowGrouping: ["category", "region"] as string[],
    columnResizing: true,
  },
} as const;
