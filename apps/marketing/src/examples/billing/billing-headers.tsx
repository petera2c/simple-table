import type {
  ReactColumnDef,
  CellRendererProps,
  ValueFormatterProps,
  ValueGetterProps,
} from "@simple-table/react";
import { ProgressBar, getThemeColors } from "../_shared";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Generate header configs for 2024 months
const generateMonthHeaders = () => {
  const headers: ReactColumnDef[] = [];
  const year = 2024;

  // Add all months for 2024 in reverse chronological order (Dec to Jan)
  for (let monthIndex = 11; monthIndex >= 0; monthIndex--) {
    const fullMonthName = new Date(year, monthIndex).toLocaleString("default", { month: "long" });

    headers.push({
      accessor: `month_${months[monthIndex]}_${year}`,
      label: `${fullMonthName} ${year}`,
      width: 200,
      sortable: true,
      editable: false,
      align: "right",
      type: "number",
      children: [
        {
          disableReorder: true,
          label: "Balance",
          accessor: `balance_${months[monthIndex]}_${year}`,
          width: 200,
          sortable: true,
          editable: false,
          align: "right",
          type: "number",
          aggregation: { type: "sum" },
          valueFormatter: ({ value }: ValueFormatterProps) => {
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
          sortable: true,
          editable: false,
          align: "right",
          type: "number",
          aggregation: { type: "sum" },
          valueFormatter: ({ value }: ValueFormatterProps) => {
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
export const HEADERS: ReactColumnDef[] = [
  {
    accessor: "name",
    label: "Name",
    width: 250,
    expandable: true,
    sortable: true,
    editable: false,
    align: "left",
    pinned: "left",
    type: "string",
    cellRenderer: ({ row }: CellRendererProps) => {
      const name = row.name as string;

      return <div className={row.type === "account" ? "font-semibold" : ""}>{name}</div>;
    },
  },
  {
    accessor: "amount",
    label: "Total Amount",
    width: 130,
    sortable: true,
    editable: false,
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
    sortable: true,
    editable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    valueFormatter: ({ value }) => {
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
    sortable: true,
    editable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    valueFormatter: ({ value }) => {
      const recognized = value as number;
      if (recognized === undefined || recognized === null || recognized === 0) return "—";

      return `$${recognized.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    accessor: "recognizedPercent",
    label: "Recognized %",
    width: 190,
    sortable: true,
    editable: false,
    align: "left",
    type: "number",
    // Derived: share of total amount that has been recognized as revenue.
    valueGetter: ({ row }: ValueGetterProps) => {
      const amount = (row.amount as number) || 0;
      const recognized = (row.recognizedRevenue as number) || 0;
      return amount > 0 ? Math.round((recognized / amount) * 100) : 0;
    },
    cellRenderer: ({ row, theme }: CellRendererProps) => {
      const amount = (row.amount as number) || 0;
      const recognized = (row.recognizedRevenue as number) || 0;
      if (amount <= 0) return <span style={{ color: getThemeColors(theme).muted }}>—</span>;
      const percent = Math.max(0, Math.min(100, Math.round((recognized / amount) * 100)));
      const c = getThemeColors(theme);
      const color = percent >= 90 ? c.success : percent >= 50 ? c.primary : c.warning;
      return <ProgressBar percent={percent} theme={theme} color={color} caption={`${percent}%`} />;
    },
  },
  ...generateMonthHeaders(), // Add the monthly columns
];
