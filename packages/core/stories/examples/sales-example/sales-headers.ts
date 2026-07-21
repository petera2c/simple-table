/**
 * Sales example headers – ported from React sales-headers (vanilla-compatible).
 * Cell renderers return strings; no React components.
 */
import type { ColumnDef } from "../../../src/index";

export const SALES_HEADERS: ColumnDef[] = [
  {
    pinned: "left",
    accessor: "repName",
    label: "Sales Representative",
    width: "2fr",
    minWidth: 200,
    sortable: true,
    editable: true,
    type: "string",
    headerRenderer: ({ header, components }) => {
      const wrap = document.createElement("div");
      wrap.style.display = "flex";
      wrap.style.alignItems = "center";
      wrap.style.gap = "8px";

      const icon = document.createElement("span");
      icon.textContent = "🧑‍💼";
      icon.setAttribute("aria-hidden", "true");

      const label = components?.labelContent;
      if (label instanceof HTMLElement) {
        wrap.appendChild(icon);
        wrap.appendChild(label);
      } else {
        const text = document.createElement("span");
        text.style.fontWeight = "700";
        text.textContent = String(header.label);
        wrap.appendChild(icon);
        wrap.appendChild(text);
      }

      const sortIcon = components?.sortIcon;
      if (sortIcon instanceof HTMLElement) wrap.appendChild(sortIcon);

      return wrap;
    },
  },
  {
    pinned: "left",
    accessor: "salesMetrics",
    label: "Sales Metrics",
    width: 600,
    sortable: false,
    children: [
      {
        accessor: "dealSize",
        label: "Deal Size",
        width: "1fr",
        minWidth: 140,
        sortable: true,
        editable: true,
        align: "right",
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) => {
          if (value === undefined || value === null || value === "—") return "—";
          return `$${Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessor: "dealValue",
        label: "Deal Value",
        width: "1fr",
        minWidth: 140,
        sortable: true,
        editable: true,
        align: "right",
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) => {
          if (value === undefined || value === null || value === "—") return "—";
          return `$${Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessor: "isWon",
        label: "Status",
        width: "1fr",
        minWidth: 140,
        sortable: true,
        editable: true,
        align: "center",
        type: "boolean",
        cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
          row.isWon === "—" ? "—" : (row.isWon as boolean) ? "Won" : "Lost",
      },
      {
        accessor: "closeDate",
        label: "Close Date",
        width: "1fr",
        minWidth: 140,
        sortable: true,
        editable: true,
        align: "center",
        type: "date",
        valueFormatter: ({ value }: { value?: unknown }) => {
          if (!value || value === "—") return "—";
          const str = String(value);
          const [year, month, day] = str.split("-").map(Number);
          const date = new Date(year, month - 1, day, 12, 0, 0);
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        },
      },
    ],
  },
  {
    accessor: "financialMetrics",
    label: "Financial Metrics",
    width: "1fr",
    minWidth: 140,
    sortable: false,
    children: [
      {
        accessor: "commission",
        label: "Commission",
        width: "1fr",
        minWidth: 140,
        sortable: true,
        editable: true,
        align: "right",
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) => {
          if (value === undefined || value === null || value === "—") return "—";
          return `$${Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessor: "profitMargin",
        label: "Profit Margin",
        width: "1fr",
        minWidth: 140,
        sortable: true,
        editable: true,
        align: "right",
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) => {
          if (value === undefined || value === null || value === "—") return "—";
          return `${(Number(value) * 100).toFixed(1)}%`;
        },
      },
      {
        accessor: "dealProfit",
        label: "Deal Profit",
        width: "1fr",
        minWidth: 140,
        sortable: true,
        editable: true,
        align: "right",
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) => {
          if (value === undefined || value === null || value === "—") return "—";
          return `$${Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessor: "category",
        label: "Category",
        width: "1fr",
        minWidth: 140,
        sortable: true,
        editable: true,
        align: "center",
        type: "enum",
        enumOptions: [
          { label: "Software", value: "Software" },
          { label: "Hardware", value: "Hardware" },
          { label: "Services", value: "Services" },
          { label: "Consulting", value: "Consulting" },
          { label: "Training", value: "Training" },
          { label: "Support", value: "Support" },
        ],
      },
    ],
  },
];
