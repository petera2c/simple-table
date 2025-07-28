import { STColumn } from "../../../types/HeaderObject";

const months: (
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec"
)[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type BillingCharge = {
  id: string;
  type: string;
  name: string;
  createdDate: string;
  amount: number;
  recognizedRevenue: number;
  deferredRevenue: number;
  month_Jan_2024: number;
  month_Feb_2024: number;
  month_Mar_2024: number;
  month_Apr_2024: number;
  month_May_2024: number;
  month_Jun_2024: number;
  month_Jul_2024: number;
  month_Aug_2024: number;
  month_Sep_2024: number;
  month_Oct_2024: number;
  month_Nov_2024: number;
  month_Dec_2024: number;
  revenue_Jan_2024: number;
  revenue_Feb_2024: number;
  revenue_Mar_2024: number;
  revenue_Apr_2024: number;
  revenue_May_2024: number;
  revenue_Jun_2024: number;
  revenue_Jul_2024: number;
  revenue_Aug_2024: number;
  revenue_Sep_2024: number;
  revenue_Oct_2024: number;
  revenue_Nov_2024: number;
  revenue_Dec_2024: number;
  balance_Jan_2024: number;
  balance_Feb_2024: number;
  balance_Mar_2024: number;
  balance_Apr_2024: number;
  balance_May_2024: number;
  balance_Jun_2024: number;
  balance_Jul_2024: number;
  balance_Aug_2024: number;
  balance_Sep_2024: number;
  balance_Oct_2024: number;
  balance_Nov_2024: number;
  balance_Dec_2024: number;
};

type BillingInvoice = {
  id: string;
  type: string;
  name: string;
  status: string;
  createdDate: string;
  dueDate: string;
  charges: BillingCharge[];
};

export type BillingRowData = {
  id: string;
  type: string;
  name: string;
  status: string;
  createdDate: string;
  invoices: BillingInvoice[];
};

// Generate header configs for 2024 months
const generateMonthHeaders = () => {
  const headers: STColumn<BillingRowData>[] = [];
  const year = 2024;

  // Add all months for 2024 in reverse chronological order (Dec to Jan)
  for (let monthIndex = 11; monthIndex >= 0; monthIndex--) {
    const fullMonthName = new Date(year, monthIndex).toLocaleString("default", { month: "long" });

    headers.push({
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
          cellRenderer: ({ row, accessor }) => {
            const balance = row[accessor] as number;
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
          cellRenderer: ({ row, accessor }) => {
            const revenue = row[accessor] as number;
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
export const HEADERS: STColumn<BillingRowData>[] = [
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
    cellRenderer: ({ row }) => {
      const amount = row.amount as number;
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
