/**
 * Sales example headers – ported from React sales-headers (vanilla-compatible).
 * Cell renderers return strings; no React components.
 */
import type { CellRendererProps, ColumnDef } from "../../../src/index";

export interface SalesRow {
  id: string;
  repName: string;
  dealSize: number;
  isWon: boolean | string;
  commission: number;
  dealProfit: number;
  dealValue: number;
  profitMargin: number;
  closeDate: string;
  category: string;
}

export const SALES_HEADERS: ColumnDef<SalesRow>[] = [
  {
    pinned: "left",
    accessor: "repName",
    label: "Sales Representative",
    width: "auto",
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
    width: "auto",
    sortable: false,
    children: [
      {
        accessor: "dealSize",
        label: "Deal Size",
        width: "auto",
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
        width: "auto",
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
        width: "auto",
        minWidth: 140,
        sortable: true,
        editable: true,
        align: "center",
        type: "boolean",
        cellRenderer: ({ row }: CellRendererProps<SalesRow>) =>
          row.isWon === "—" ? "—" : (row.isWon as boolean) ? "Won" : "Lost",
      },
      {
        accessor: "closeDate",
        label: "Close Date",
        width: "auto",
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
    width: "auto",
    minWidth: 140,
    sortable: false,
    children: [
      {
        accessor: "commission",
        label: "Commission",
        width: "auto",
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
        width: "auto",
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
        width: "auto",
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
        width: "auto",
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

export type SalesLocale = "en" | "ko";

const SALES_COLUMN_LABELS: Record<SalesLocale, Record<string, string>> = {
  en: {
    repName: "Sales Representative",
    salesMetrics: "Sales Metrics",
    dealSize: "Deal Size",
    dealValue: "Deal Value",
    isWon: "Status",
    closeDate: "Close Date",
    financialMetrics: "Financial Metrics",
    commission: "Commission",
    profitMargin: "Profit Margin",
    dealProfit: "Deal Profit",
    category: "Category",
  },
  ko: {
    repName: "영업 담당자",
    salesMetrics: "영업 지표",
    dealSize: "거래 규모",
    dealValue: "거래 금액",
    isWon: "상태",
    closeDate: "마감일",
    financialMetrics: "재무 지표",
    commission: "수수료",
    profitMargin: "이익률",
    dealProfit: "거래 이익",
    category: "카테고리",
  },
};

/** Copy columns and set each label from the chosen language. */
export function applySalesColumnLabels(
  columns: readonly ColumnDef<SalesRow>[],
  locale: SalesLocale,
): ColumnDef<SalesRow>[] {
  const labels = SALES_COLUMN_LABELS[locale];
  return columns.map((column) => ({
    ...column,
    label: labels[String(column.accessor)] ?? column.label,
    children: column.children
      ? applySalesColumnLabels(column.children, locale)
      : column.children,
  }));
}
