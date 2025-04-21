import HeaderObject from "../../../types/HeaderObject";

export const HEADERS: HeaderObject[] = [
  {
    accessor: "ticker",
    label: "Symbol",
    width: "1fr",
    minWidth: 100,
    isSortable: true,
    isEditable: false,
    align: "left",
    pinned: "left",
    type: "string",
  },

  {
    accessor: "companyName",
    label: "Name",
    width: "2fr",
    minWidth: 200,
    isSortable: true,
    isEditable: false,
    align: "left",
    type: "string",
  },

  {
    accessor: "fundamentals",
    label: "Fundamentals",
    width: 380,
    isSortable: false,
    children: [
      {
        accessor: "marketCap",
        label: "Mkt Cap ($B)",
        width: 140,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row }) => {
          if (row.rowData.marketCap === "—") return "—";
          return (row.rowData.marketCap as number).toLocaleString("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          });
        },
      },
      {
        accessor: "peRatio",
        label: "P/E Ratio",
        width: 140,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row }) => {
          if (row.rowData.peRatio === "—" || row.rowData.peRatio === null) return "—";
          return (row.rowData.peRatio as number).toFixed(1);
        },
      },
      {
        accessor: "dividendYield",
        label: "Div Yield",
        width: 140,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row }) => {
          if (row.rowData.dividendYield === "—" || row.rowData.dividendYield === null) return "—";
          return `${(row.rowData.dividendYield as number).toFixed(2)}%`;
        },
      },
    ],
  },
  {
    accessor: "priceMetrics",
    label: "Price Performance",
    width: "1fr",
    isSortable: false,
    children: [
      {
        accessor: "price",
        label: "Price (USD)",
        width: 140,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row }) => {
          if (row.rowData.price === "—") return "—";
          return `$${(row.rowData.price as number).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessor: "priceChangePercent",
        label: "Change %",
        width: 140,
        isSortable: true,
        isEditable: false,
        align: "right",
        type: "number",
        cellRenderer: ({ row }) => {
          if (row.rowData.priceChangePercent === "—" || row.rowData.priceChangePercent === null)
            return "—";
          const value = row.rowData.priceChangePercent as number;
          const color = value < 0 ? "text-red-600" : value > 0 ? "text-green-600" : "text-gray-600";
          const prefix = value > 0 ? "+" : "";
          const bgColor = value < 0 ? "bg-red-50" : value > 0 ? "bg-green-50" : "";

          return (
            <div className={`px-2 py-1 rounded font-medium ${bgColor} ${color}`}>
              {prefix}
              {value.toFixed(2)}%
            </div>
          );
        },
      },
    ],
  },
];
