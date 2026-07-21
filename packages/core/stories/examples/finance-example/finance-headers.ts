/**
 * Finance example headers – ported from React finance-headers (vanilla-compatible).
 */
import type { ColumnDef } from "../../../src/index";

export const FINANCE_HEADERS: ColumnDef[] = [
  {
    accessor: "ticker",
    align: "left",
    filterable: true,
    editable: false,
    sortable: true,
    label: "Symbol",
    minWidth: 120,
    pinned: "left",
    type: "string",
    width: "1fr",
  },
  {
    accessor: "companyName",
    align: "left",
    filterable: true,
    editable: false,
    sortable: true,
    label: "Name",
    minWidth: 220,
    type: "string",
    width: "2fr",
  },
  {
    accessor: "priceMetrics",
    label: "Price Performance",
    width: 250,
    sortable: false,
    collapsible: true,
    children: [
      {
        accessor: "price",
        label: "Price (USD)",
        width: 160,
        sortable: true,
        filterable: true,
        editable: true,
        align: "right",
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) => {
          if (value === "—" || value === undefined || value === null) return "—";
          return `$${Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessor: "priceChangePercent",
        label: "Change %",
        width: 160,
        filterable: true,
        sortable: true,
        editable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
          const val = row.priceChangePercent;
          if (val === "—" || val === null || val === undefined) return "—";
          const value = Number(val);
          const prefix = value > 0 ? "+" : "";
          return `${prefix}${value.toFixed(2)}%`;
        },
      },
    ],
  },
  {
    accessor: "fundamentals",
    label: "Fundamentals",
    width: 380,
    sortable: false,
    collapsible: true,
    children: [
      {
        accessor: "marketCap",
        label: "Mkt Cap ($B)",
        width: 180,
        sortable: true,
        filterable: true,
        editable: true,
        showWhen: "parentCollapsed",
        align: "right",
        type: "number",
      },
      {
        accessor: "peRatio",
        label: "P/E Ratio",
        width: 160,
        sortable: true,
        filterable: true,
        editable: true,
        align: "right",
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) => {
          if (value === "—" || value === null || value === undefined) return "—";
          return Number(value).toFixed(1);
        },
      },
      {
        accessor: "dividendYield",
        label: "Div Yield",
        width: 160,
        sortable: true,
        filterable: true,
        editable: true,
        align: "right",
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) => {
          if (value === "—" || value === null || value === undefined) return "—";
          return `${Number(value).toFixed(2)}%`;
        },
      },
    ],
  },
  {
    accessor: "analystInfo",
    label: "Analyst Information",
    width: 380,
    sortable: false,
    children: [
      {
        accessor: "analystRating",
        label: "Rating",
        width: 160,
        sortable: true,
        editable: true,
        filterable: true,
        align: "center",
        type: "enum",
        enumOptions: [
          { label: "Strong Buy", value: "Strong Buy" },
          { label: "Buy", value: "Buy" },
          { label: "Hold", value: "Hold" },
          { label: "Sell", value: "Sell" },
          { label: "Strong Sell", value: "Strong Sell" },
        ],
        cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
          row.analystRating ? String(row.analystRating) : "—",
      },
      {
        filterable: true,
        accessor: "date",
        label: "Date",
        width: 160,
        sortable: true,
        editable: true,
        align: "center",
        type: "date",
      },
      {
        accessor: "isFollowed",
        label: "Following",
        width: 160,
        filterable: true,
        sortable: true,
        editable: true,
        align: "center",
        type: "boolean",
      },
    ],
  },
];
