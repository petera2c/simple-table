import HeaderObject from "../../../types/HeaderObject";

export const HEADERS: HeaderObject[] = [
  {
    accessor: "ticker",
    label: "Symbol",
    width: "1fr",
    isSortable: true,
    isEditable: false,
    align: "left",
    pinned: "left",
  },
  {
    accessor: "sectorName",
    label: "Sector/Company",
    width: "1fr",
    minWidth: 200,
    expandable: true,
    isSortable: true,
    isEditable: false,
    align: "left",
    hide: false,
  },
  {
    accessor: "companyName",
    label: "Name",
    width: "1fr",
    minWidth: 200,
    isSortable: true,
    isEditable: false,
    align: "center",
  },
  {
    accessor: "price",
    label: "Price (USD)",
    width: "1fr",
    minWidth: 200,
    isSortable: true,
    isEditable: false,
    align: "right",
    cellRenderer: ({ row }) => {
      if (row.rowData.price === "—") return "—";
      return `$${(row.rowData.price as number).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    accessor: "analystRating",
    label: "Analyst Rating",
    width: 150,
    isSortable: true,
    isEditable: false,
    align: "center",
    cellRenderer: ({ row }) => {
      if (row.rowData.analystRating === "—") return "—";
      const value = row.rowData.analystRating as number;

      // Text ratings
      const ratingLabels = {
        5: "Strong Buy",
        4.5: "Buy+",
        4: "Buy",
        3.5: "Overweight",
        3: "Hold",
        2.5: "Underweight",
        2: "Sell",
        1.5: "Sell+",
        1: "Strong Sell",
      };

      // Color based on rating
      const getRatingColor = (val: number) => {
        if (val >= 4.5) return "green";
        if (val >= 4) return "green";
        if (val >= 3.5) return "cyan";
        if (val >= 3) return "blue";
        if (val >= 2.5) return "orange";
        if (val >= 2) return "volcano";
        return "red";
      };

      const ratingLabel = ratingLabels[(Math.round(value * 2) / 2) as keyof typeof ratingLabels] || "Hold";
      const color = getRatingColor(value);

      return (
        <div color={color} className="py-1 px-2">
          {ratingLabel}
        </div>
      );
    },
  },
  {
    accessor: "revenueGrowth",
    label: "Rev Growth",
    width: 130,
    isSortable: true,
    isEditable: false,
    align: "right",
    cellRenderer: ({ row }) => {
      if (row.rowData.revenueGrowth === "—") return "—";
      const value = row.rowData.revenueGrowth as number;
      const color = value < 0 ? "text-red-600" : value > 0 ? "text-green-600" : "text-gray-600";
      const prefix = value > 0 ? "+" : "";
      return (
        <span className={color}>
          {prefix}
          {value}%
        </span>
      );
    },
  },
  {
    accessor: "marketCap",
    label: "Mkt Cap ($B)",
    width: 130,
    isSortable: true,
    isEditable: false,
    align: "right",
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
    width: 120,
    isSortable: true,
    isEditable: false,
    align: "right",
    cellRenderer: ({ row }) => {
      if (row.rowData.peRatio === "—") return "—";
      return (row.rowData.peRatio as number).toFixed(1);
    },
  },
  {
    accessor: "dividendYield",
    label: "Div Yield",
    width: 120,
    isSortable: true,
    isEditable: false,
    align: "right",
    cellRenderer: ({ row }) => {
      if (row.rowData.dividendYield === "—") return "—";
      return `${(row.rowData.dividendYield as number).toFixed(2)}%`;
    },
  },
  {
    accessor: "profitMargin",
    label: "Profit Margin",
    width: 130,
    isSortable: true,
    isEditable: false,
    align: "right",
    cellRenderer: ({ row }) => {
      if (row.rowData.profitMargin === "—") return "—";
      return `${row.rowData.profitMargin}%`;
    },
  },
  {
    accessor: "esgScore",
    label: "ESG Score",
    width: 120,
    isSortable: true,
    isEditable: false,
    align: "right",
    cellRenderer: ({ row }) => {
      if (row.rowData.esgScore === "—") return "—";
      const value = row.rowData.esgScore as number;
      // Color based on score
      const getColorClass = () => {
        if (value >= 80) return "text-green-600";
        if (value >= 60) return "text-green-500";
        if (value >= 40) return "text-orange-500";
        return "text-red-500";
      };

      return <span className={getColorClass()}>{value}</span>;
    },
  },
  {
    accessor: "priceChangePercent",
    label: "Change %",
    width: 120,
    isSortable: true,
    isEditable: false,
    align: "right",
    pinned: "right",
    cellRenderer: ({ row }) => {
      if (row.rowData.priceChangePercent === "—") return "—";
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
];
