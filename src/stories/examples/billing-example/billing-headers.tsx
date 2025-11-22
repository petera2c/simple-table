import { HeaderObject } from "../../..";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Generate header configs for 2024 months
const generateMonthHeaders = () => {
  const headers: HeaderObject[] = [];
  const year = 2024;

  // Add all months for 2024 in reverse chronological order (Dec to Jan)
  for (let monthIndex = 11; monthIndex >= 0; monthIndex--) {
    const fullMonthName = new Date(year, monthIndex).toLocaleString("default", { month: "long" });

    headers.push({
      accessor: `month_${months[monthIndex]}_${year}`,
      label: `${fullMonthName} ${year}`,
      width: 200,
      isSortable: true,
      isEditable: false,
      align: "right",
      type: "number",
      children: [
        {
          disableReorder: true,
          label: "Balance",
          accessor: `balance_${months[monthIndex]}_${year}`,
          width: 200,
          isSortable: true,
          isEditable: false,
          align: "right",
          type: "number",
          aggregation: { type: "sum" },
          valueFormatter: ({ value }) => {
            const balance = value as number;
            if (balance === undefined || balance === null || balance === 0) return "—";

            return `$${balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
        {
          disableReorder: true,
          label: "Revenue",
          accessor: `revenue_${months[monthIndex]}_${year}`,
          width: 200,
          isSortable: true,
          isEditable: false,
          align: "right",
          type: "number",
          aggregation: { type: "sum" },
          valueFormatter: ({ value }) => {
            const revenue = value as number;
            if (revenue === undefined || revenue === null || revenue === 0) return "—";

            return `$${revenue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      ],
    });
  }

  return headers;
};

// Main headers
export const HEADERS: HeaderObject[] = [
  {
    accessor: "name",
    label: "Name",
    width: 250,
    expandable: true,
    isSortable: true,
    isEditable: false,
    align: "left",
    pinned: "left",
    type: "string",
    cellRenderer: ({ row }) => {
      const name = row.name as string;

      return <div className={row.type === "account" ? "font-semibold" : ""}>{name}</div>;
    },
  },
  {
    accessor: "amount",
    label: "Total Amount",
    width: 130,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    valueFormatter: ({ value }) => {
      const amount = value as number;
      if (amount === undefined || amount === null || amount === 0) return "—";

      return `$${amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    accessor: "deferredRevenue",
    label: "Deferred Revenue",
    width: 180,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    cellRenderer: ({ row }) => {
      const deferred = row.deferredRevenue as number;
      if (deferred === undefined || deferred === null || deferred === 0) return "—";

      return `$${deferred.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    accessor: "recognizedRevenue",
    label: "Recognized Revenue",
    width: 180,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    cellRenderer: ({ row }) => {
      const recognized = row.recognizedRevenue as number;
      if (recognized === undefined || recognized === null || recognized === 0) return "—";

      return `$${recognized.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  ...generateMonthHeaders(), // Add the monthly columns
];
