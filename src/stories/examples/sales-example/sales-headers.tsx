import { HeaderObject } from "../../..";

export const SALES_HEADERS: HeaderObject[] = [
  {
    accessor: "repName",
    label: "Sales Representative",
    width: "2fr",
    minWidth: 200,
    isSortable: false,
  },
  {
    accessor: "salesMetrics",
    label: "Sales Metrics",
    width: 460,
    isSortable: false,
    children: [
      {
        accessor: "dealSize",
        label: "Deal Size",
        width: "1fr",
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row }) => {
          if (row.rowData.dealSize === "—") return "—";
          return `$${(row.rowData.dealSize as number).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
      },

      {
        accessor: "dealValue",
        label: "Deal Value",
        width: "1fr",
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row }) => {
          if (row.rowData.dealValue === "—") return "—";
          return `$${(row.rowData.dealValue as number).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessor: "isWon",
        label: "Status",
        width: "1fr",
        isSortable: true,
        isEditable: false,
        align: "center",
        type: "boolean",
      },
    ],
  },

  {
    accessor: "financialMetrics",
    label: "Financial Metrics",
    width: "1fr",
    isSortable: false,
    children: [
      {
        accessor: "commission",
        label: "Commission",
        width: "1fr",
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row }) => {
          if (row.rowData.commission === "—") return "—";
          return `$${(row.rowData.commission as number).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessor: "profitMargin",
        label: "Profit Margin",
        width: "1fr",
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row }) => {
          if (row.rowData.profitMargin === "—") return "—";
          const value = row.rowData.profitMargin as number;
          const color =
            value >= 0.5 ? "text-green-600" : value >= 0.3 ? "text-green-500" : "text-blue-500";
          return <span className={color}>{(value * 100).toFixed(1)}%</span>;
        },
      },
      {
        accessor: "dealProfit",
        label: "Deal Profit",
        width: "1fr",
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row }) => {
          if (row.rowData.dealProfit === "—") return "—";
          return `$${(row.rowData.dealProfit as number).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
      },
    ],
  },
];
