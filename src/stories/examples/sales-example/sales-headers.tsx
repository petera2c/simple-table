import Row from "../../../types/Row";
import HeaderObject from "../../../types/HeaderObject";

export const SALES_HEADERS: HeaderObject[] = [
  {
    accessor: "repName",
    label: "Sales Representative",
    width: "2fr",
    minWidth: 200,
    isSortable: true,
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
          if (row.dealSize === "—") return "—";
          return `$${(row.dealSize as number).toLocaleString("en-US", {
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
          if (row.dealValue === "—") return "—";
          const value = row.dealValue as number;

          // Color code based on value tiers
          let valueClass = "text-gray-700";
          if (value > 100000) valueClass = "text-green-700 font-bold";
          else if (value > 50000) valueClass = "text-green-600";
          else if (value > 10000) valueClass = "text-green-500";

          return (
            <span className={valueClass}>
              $
              {value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
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
        cellRenderer: ({ row }: { row: Row }) => {
          if (row.isWon === "—") return "—";
          const isWon = row.isWon as boolean;
          return isWon ? "Won" : "Lost";
        },
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
        cellRenderer: ({ row }: { row: Row }) => {
          if (row.commission === "—") return "—";
          const value = row.commission as number;
          if (value === 0) return <span className="text-gray-400">$0.00</span>;

          return `$${value.toLocaleString("en-US", {
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
        cellRenderer: ({ row }: { row: Row }) => {
          if (row.profitMargin === "—") return "—";
          const value = row.profitMargin as number;

          // Enhanced color coding based on profit margin tiers
          let colorClass = "";
          if (value >= 0.7) colorClass = "text-green-700 font-bold"; // Software-like margins
          else if (value >= 0.5) colorClass = "text-green-600";
          else if (value >= 0.4) colorClass = "text-green-500";
          else if (value >= 0.3) colorClass = "text-blue-500";
          else colorClass = "text-yellow-600"; // Hardware-like margins

          return (
            <div className="flex items-center justify-end">
              <span className={colorClass}>{(value * 100).toFixed(1)}%</span>
            </div>
          );
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
        cellRenderer: ({ row }: { row: Row }) => {
          if (row.dealProfit === "—") return "—";
          const value = row.dealProfit as number;
          if (value === 0) return <span className="text-gray-400">$0.00</span>;

          // Color code based on profit tiers
          let profitClass = "text-gray-700";
          if (value > 50000) profitClass = "text-green-700 font-bold";
          else if (value > 20000) profitClass = "text-green-600";
          else if (value > 10000) profitClass = "text-green-500";

          return (
            <span className={profitClass}>
              $
              {value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
    ],
  },
];
