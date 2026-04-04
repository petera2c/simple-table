// Self-contained demo table setup for this example.
import type { HeaderObject } from "@simple-table/solid";

export interface SalesRow {
  id: number;
  repName: string;
  dealSize: number;
  dealValue: number;
  isWon: boolean;
  closeDate: string;
  commission: number;
  profitMargin: number;
  dealProfit: number;
  category: string;
}


const SALES_REP_NAMES = ["Alex Morgan", "Sam Rivera", "Jordan Lee", "Taylor Kim", "Casey Chen", "Riley Park", "Morgan Wells", "Avery Quinn", "Devon Blake", "Harper Cole", "Quinn Foster", "Sage Turner", "Cameron Reed", "Jesse Nash", "Blake Palmer"];
const CATEGORIES = ["Software", "Hardware", "Services", "Consulting", "Training", "Support"];

export function generateSalesData(count: number = 100): SalesRow[] {
  return Array.from({ length: count }, (_, i) => {
    const dealSize = Math.round((5000 + Math.random() * 200000) * 100) / 100;
    const profitMargin = Math.round((0.15 + Math.random() * 0.7) * 1000) / 1000;
    const dealValue = Math.round((dealSize / profitMargin) * 100) / 100;
    const commission = Math.round(dealValue * 0.1 * 100) / 100;
    const dealProfit = Math.round((dealSize - commission) * 100) / 100;
    const closeYear = 2023 + Math.floor(Math.random() * 2);
    const closeMonth = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
    const closeDay = String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");

    return {
      id: i + 1,
      repName: SALES_REP_NAMES[i % SALES_REP_NAMES.length],
      dealSize,
      dealValue,
      isWon: Math.random() > 0.35,
      closeDate: `${closeYear}-${closeMonth}-${closeDay}`,
      commission,
      profitMargin,
      dealProfit,
      category: CATEGORIES[i % CATEGORIES.length],
    };
  });
}

export const salesData = generateSalesData(100);

export const salesHeaders: HeaderObject[] = [
  { accessor: "repName", label: "Sales Representative", width: "2fr", minWidth: 200, isSortable: true, isEditable: true, type: "string", tooltip: "Name of the sales representative" },
  {
    accessor: "salesMetrics", label: "Sales Metrics", width: 600, isSortable: false,
    children: [
      {
        accessor: "dealSize", label: "Deal Size", width: "1fr", minWidth: 140, isSortable: true, isEditable: true, align: "right", type: "number", tooltip: "The size of the deal in dollars",
        valueFormatter: ({ value }) => { if (typeof value !== "number") return "—"; return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; },
        useFormattedValueForClipboard: true, useFormattedValueForCSV: true,
      },
      { accessor: "dealValue", label: "Deal Value", width: "1fr", minWidth: 140, isSortable: true, isEditable: true, align: "right", type: "number", tooltip: "The value of the deal in dollars" },
      { accessor: "isWon", label: "Status", width: "1fr", minWidth: 140, isSortable: true, isEditable: true, align: "center", type: "boolean", tooltip: "Whether the deal was won or lost" },
      {
        accessor: "closeDate", label: "Close Date", width: "1fr", minWidth: 140, isSortable: true, isEditable: true, align: "center", type: "date", tooltip: "The date the deal was closed",
        valueFormatter: ({ value }) => {
          if (typeof value !== "string") return "—";
          const [year, month, day] = value.split("-").map(Number);
          const date = new Date(year, month - 1, day);
          return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        },
      },
    ],
  },
  {
    accessor: "financialMetrics", label: "Financial Metrics", width: "1fr", minWidth: 140, isSortable: false,
    children: [
      { accessor: "commission", label: "Commission", width: "1fr", minWidth: 140, isSortable: true, isEditable: true, align: "right", type: "number", tooltip: "The commission earned from the deal in dollars" },
      {
        accessor: "profitMargin", label: "Profit Margin", width: "1fr", minWidth: 140, isSortable: true, isEditable: true, align: "right", type: "number", tooltip: "The profit margin of the deal",
        valueFormatter: ({ value }) => { if (typeof value !== "number") return "—"; return `${(value * 100).toFixed(1)}%`; },
        useFormattedValueForClipboard: true,
        exportValueGetter: ({ value }) => { if (typeof value !== "number") return "—"; return `${Math.round(value * 100)}%`; },
      },
      { accessor: "dealProfit", label: "Deal Profit", width: "1fr", minWidth: 140, isSortable: true, isEditable: true, align: "right", type: "number", tooltip: "The profit of the deal in dollars" },
      {
        accessor: "category", label: "Category", width: "1fr", minWidth: 140, isSortable: true, isEditable: true, align: "center", type: "enum", tooltip: "The category of the deal",
        enumOptions: CATEGORIES.map((c) => ({ label: c, value: c })),
        valueGetter: ({ row }) => {
          const priorityMap: Record<string, number> = { Software: 1, Consulting: 2, Services: 3, Hardware: 4, Training: 5, Support: 6 };
          return priorityMap[String(row.category)] || 999;
        },
      },
    ],
  },
];

export function getSalesThemeColors(theme?: string) {
  const isDark = theme === "dark" || theme === "modern-dark";
  return {
    gray: isDark ? "#f3f4f6" : "#374151",
    grayMuted: isDark ? "#f3f4f6" : "#9ca3af",
    successHigh: { color: isDark ? "#86efac" : "#15803d", fontWeight: "bold" as const },
    successMedium: isDark ? "#4ade80" : "#16a34a",
    successLow: isDark ? "#22c55e" : "#22c55e",
    info: isDark ? "#60a5fa" : "#3b82f6",
    warning: isDark ? "#facc15" : "#ca8a04",
    progressHigh: isDark ? "#34D399" : "#10B981",
    progressMedium: isDark ? "#60A5FA" : "#3B82F6",
    progressLow: isDark ? "#FBBF24" : "#D97706",
  };
}

export const salesConfig = {
  headers: salesHeaders,
  rows: salesData,
} as const;
