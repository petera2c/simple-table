/**
 * Billing example headers – ported from React billing-headers (vanilla-compatible).
 */
import type { HeaderObject } from "../../../src/index";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function generateMonthHeaders(): HeaderObject[] {
  const headers: HeaderObject[] = [];
  const year = 2024;

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
          valueFormatter: ({ value }: { value?: unknown }) => {
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
          valueFormatter: ({ value }: { value?: unknown }) => {
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
}

export const BILLING_HEADERS: HeaderObject[] = [
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
    cellRenderer: ({ row }: { row: Record<string, unknown> }) => String(row.name ?? ""),
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
    valueFormatter: ({ value }: { value?: unknown }) => {
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
    valueFormatter: ({ value }: { value?: unknown }) => {
      const deferred = value as number;
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
    valueFormatter: ({ value }: { value?: unknown }) => {
      const recognized = value as number;
      if (recognized === undefined || recognized === null || recognized === 0) return "—";
      return `$${recognized.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  ...generateMonthHeaders(),
];
