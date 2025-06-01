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
      isEditable: true,
      align: "right",
      type: "number",
      children: [
        {
          disableReorder: true,
          label: "Balance",
          accessor: `balance_${months[monthIndex]}_${year}`,
          width: 200,
          isSortable: true,
          isEditable: true,
          align: "right",
          type: "number",
          cellRenderer: ({ row, accessor }) => {
            const balance = row[accessor] as number;
            if (!balance) return "—";

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
          isEditable: true,
          align: "right",
          type: "number",
          cellRenderer: ({ row, accessor }) => {
            const revenue = row[accessor] as number;
            if (!revenue) return "—";

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
    isEditable: true,
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
    cellRenderer: ({ row }) => {
      const amount = row.amount as number;
      if (!amount) return "—";

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
    isEditable: true,
    align: "right",
    type: "number",
    cellRenderer: ({ row }) => {
      const amount = row.amount as number;
      const deferred = row.deferredRevenue as number;

      if (deferred === undefined || amount === undefined) return "—";

      return `$${deferred.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  ...generateMonthHeaders(), // Add the monthly columns
];
