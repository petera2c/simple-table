import type { AngularColumnDef, ValueFormatterProps, ValueGetterProps } from "@simple-table/angular";

type SuccessHighStyle = { color: string; fontWeight: "bold" };
type ThemePalette = {
  gray: string;
  grayMuted: string;
  success: { high: SuccessHighStyle; medium: string; low: string };
  info: string;
  warning: string;
  progressColors: { high: string; medium: string; low: string };
};

export function getThemeColors(theme?: string): ThemePalette {
  const themes: Record<string, ThemePalette> = {
    "modern-light": {
      gray: "#374151",
      grayMuted: "#9ca3af",
      success: {
        high: { color: "#15803d", fontWeight: "bold" },
        medium: "#16a34a",
        low: "#22c55e",
      },
      info: "#3b82f6",
      warning: "#ca8a04",
      progressColors: { high: "#10B981", medium: "#3B82F6", low: "#D97706" },
    },
    light: {
      gray: "#374151",
      grayMuted: "#9ca3af",
      success: {
        high: { color: "#15803d", fontWeight: "bold" },
        medium: "#16a34a",
        low: "#22c55e",
      },
      info: "#3b82f6",
      warning: "#ca8a04",
      progressColors: { high: "#10B981", medium: "#3B82F6", low: "#D97706" },
    },
    "modern-dark": {
      gray: "#f3f4f6",
      grayMuted: "#f3f4f6",
      success: {
        high: { color: "#86efac", fontWeight: "bold" },
        medium: "#4ade80",
        low: "#22c55e",
      },
      info: "#60a5fa",
      warning: "#facc15",
      progressColors: { high: "#34D399", medium: "#60A5FA", low: "#FBBF24" },
    },
    dark: {
      gray: "#f3f4f6",
      grayMuted: "#f3f4f6",
      success: {
        high: { color: "#86efac", fontWeight: "bold" },
        medium: "#4ade80",
        low: "#22c55e",
      },
      info: "#60a5fa",
      warning: "#facc15",
      progressColors: { high: "#34D399", medium: "#60A5FA", low: "#FBBF24" },
    },
    neutral: {
      gray: "#1f2937",
      grayMuted: "#9ca3af",
      success: {
        high: { color: "#1f2937", fontWeight: "bold" },
        medium: "#374151",
        low: "#4b5563",
      },
      info: "#6b7280",
      warning: "#6b7280",
      progressColors: { high: "#6B7280", medium: "#9CA3AF", low: "#D1D5DB" },
    },
    custom: {
      gray: "#9ca3af",
      grayMuted: "#e5e7eb",
      success: {
        high: { color: "#15803d", fontWeight: "bold" },
        medium: "#16a34a",
        low: "#22c55e",
      },
      info: "#3b82f6",
      warning: "#ca8a04",
      progressColors: { high: "#10B981", medium: "#3B82F6", low: "#D97706" },
    },
  };
  return themes[theme === "modern-black" ? "modern-dark" : (theme ?? "")] ?? themes["modern-light"];
}

export interface SalesInboundRow {
  id: string;
  repName: string;
  dealSize: number;
  isWon: boolean;
  profitMargin: number;
  closeDate: string;
  category: string;
}

export interface SalesRow extends SalesInboundRow {
  dealValue: number;
  commission: number;
  dealProfit: number;
}

function processSalesData(salesData: SalesInboundRow[]): SalesRow[] {
  return salesData.map((sale) => {
    const dealValue = sale.dealSize / sale.profitMargin;
    const commission = dealValue * 0.1;
    const dealProfit = sale.dealSize - commission;
    return {
      ...sale,
      dealValue: parseFloat(dealValue.toFixed(2)),
      commission: parseFloat(commission.toFixed(2)),
      dealProfit: parseFloat(dealProfit.toFixed(2)),
    };
  });
}

const SALES_SAMPLE_INBOUND: SalesInboundRow[] = [
  { id: "SALE-0", repName: "Sophie Dubois", dealSize: 27430.48, isWon: true, profitMargin: 0.49, closeDate: "2026-02-08", category: "Support" },
  { id: "SALE-1", repName: "Akira Tanaka", dealSize: 16112.14, isWon: false, profitMargin: 0.31, closeDate: "2026-01-25", category: "Training" },
  { id: "SALE-2", repName: "Thomas Müller", dealSize: 523.99, isWon: true, profitMargin: 0.56, closeDate: "2026-01-20", category: "Training" },
  { id: "SALE-3", repName: "Valentina Diaz", dealSize: 373.94, isWon: true, profitMargin: 0.61, closeDate: "2026-03-06", category: "Services" },
  { id: "SALE-4", repName: "Isabella Fernandez", dealSize: 5955.97, isWon: true, profitMargin: 0.31, closeDate: "2026-01-12", category: "Software" },
  { id: "SALE-5", repName: "Emily Davis", dealSize: 126.47, isWon: true, profitMargin: 0.69, closeDate: "2026-02-13", category: "Services" },
  { id: "SALE-6", repName: "Olivia Bennett", dealSize: 128.85, isWon: false, profitMargin: 0.42, closeDate: "2026-03-01", category: "Hardware" },
  { id: "SALE-7", repName: "Marcus Webb", dealSize: 89200.0, isWon: true, profitMargin: 0.55, closeDate: "2026-02-28", category: "Software" },
  { id: "SALE-8", repName: "Nina Kowalski", dealSize: 42000.0, isWon: true, profitMargin: 0.48, closeDate: "2026-01-18", category: "Consulting" },
  { id: "SALE-9", repName: "James Okafor", dealSize: 125000.0, isWon: true, profitMargin: 0.72, closeDate: "2026-03-15", category: "Software" },
  { id: "SALE-10", repName: "Elena Rossi", dealSize: 9800.0, isWon: false, profitMargin: 0.35, closeDate: "2026-02-02", category: "Hardware" },
  { id: "SALE-11", repName: "Chen Wei", dealSize: 156000.0, isWon: true, profitMargin: 0.68, closeDate: "2026-03-10", category: "Software" },
  { id: "SALE-12", repName: "Priya Sharma", dealSize: 22400.0, isWon: true, profitMargin: 0.44, closeDate: "2026-01-30", category: "Services" },
  { id: "SALE-13", repName: "Lars Hansen", dealSize: 51200.0, isWon: true, profitMargin: 0.52, closeDate: "2026-02-20", category: "Consulting" },
  { id: "SALE-14", repName: "Amélie Laurent", dealSize: 3100.0, isWon: true, profitMargin: 0.28, closeDate: "2026-03-22", category: "Training" },
  { id: "SALE-15", repName: "Diego Alvarez", dealSize: 67800.0, isWon: false, profitMargin: 0.5, closeDate: "2026-02-11", category: "Hardware" },
  { id: "SALE-16", repName: "Fatima Al-Farsi", dealSize: 18900.0, isWon: true, profitMargin: 0.63, closeDate: "2026-03-03", category: "Support" },
  { id: "SALE-17", repName: "Henrik Berg", dealSize: 94500.0, isWon: true, profitMargin: 0.58, closeDate: "2026-01-08", category: "Software" },
  { id: "SALE-18", repName: "Yuki Sato", dealSize: 7600.0, isWon: false, profitMargin: 0.33, closeDate: "2026-02-25", category: "Services" },
  { id: "SALE-19", repName: "Grace O'Malley", dealSize: 203500.0, isWon: true, profitMargin: 0.71, closeDate: "2026-03-18", category: "Software" },
];

export const salesSampleRows: SalesRow[] = processSalesData(SALES_SAMPLE_INBOUND);

export const salesHeadersCore: AngularColumnDef<SalesRow, any>[] = [
  {
    accessor: "repName",
    label: "Sales Representative",
    width: "auto",
    minWidth: 200,
    sortable: true,
    editable: true,
    type: "string",
    tooltip: "Name of the sales representative",
  },
  {
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
        tooltip: "The size of the deal in dollars",
        valueFormatter: ({ value }: ValueFormatterProps<SalesRow, number>) => {
          return `$${value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
        useFormattedValueForClipboard: true,
        useFormattedValueForCSV: true,
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
        tooltip: "The value of the deal in dollars",
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
        tooltip: "Whether the deal was won or lost",
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
        tooltip: "The date the deal was closed",
        valueFormatter: ({ value }: ValueFormatterProps<SalesRow, string>) => {
          if (!value) return "—";
          const [year, month, day] = value.split("-").map(Number);
          const date = new Date(year, month - 1, day);
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
        tooltip: "The commission earned from the deal in dollars",
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
        tooltip: "The profit margin of the deal",
        valueFormatter: ({ value }: ValueFormatterProps<SalesRow, number>) => {
          return `${(value * 100).toFixed(1)}%`;
        },
        useFormattedValueForClipboard: true,
        exportValueGetter: ({ value }) => `${Math.round(Number(value) * 100)}%`,
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
        tooltip: "The profit of the deal in dollars",
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
        tooltip: "The category of the deal",
        enumOptions: [
          { label: "Software", value: "Software" },
          { label: "Hardware", value: "Hardware" },
          { label: "Services", value: "Services" },
          { label: "Consulting", value: "Consulting" },
          { label: "Training", value: "Training" },
          { label: "Support", value: "Support" },
        ],
        valueGetter: ({ row }: ValueGetterProps<SalesRow>) => {
          const category = row.category;
          const priorityMap: Record<string, number> = {
            Software: 1,
            Consulting: 2,
            Services: 3,
            Hardware: 4,
            Training: 5,
            Support: 6,
          };
          return priorityMap[category] || 999;
        },
      },
    ],
  },
];
const FIRST_NAMES = [
  "Sophie", "Akira", "Thomas", "Valentina", "Isabella", "Emily", "Olivia", "Marcus",
  "Nina", "James", "Elena", "Chen", "Priya", "Lars", "Amélie", "Diego", "Fatima",
  "Henrik", "Yuki", "Grace", "Liam", "Noah", "Mia", "Lucas", "Aria",
];

const LAST_NAMES = [
  "Dubois", "Tanaka", "Müller", "Diaz", "Fernandez", "Davis", "Bennett", "Webb",
  "Kowalski", "Okafor", "Rossi", "Wei", "Sharma", "Hansen", "Laurent", "Alvarez",
  "Al-Farsi", "Berg", "Sato", "O'Malley", "Nguyen", "Schmidt", "Costa", "Ivanova", "Park",
];

const CATEGORIES = ["Software", "Hardware", "Services", "Consulting", "Training", "Support"];

const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const randomCloseDate = () => {
  const start = new Date(2026, 0, 1).getTime();
  const end = new Date(2026, 11, 31).getTime();
  const date = new Date(start + Math.random() * (end - start));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** Generates `count` randomized inbound sales rows, then processes derived fields. */
export function generateSalesData(count = 240): SalesRow[] {
  const inbound: SalesInboundRow[] = Array.from({ length: count }, (_, index) => ({
    id: `SALE-${index}`,
    repName: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    dealSize: parseFloat(randomBetween(100, 250000).toFixed(2)),
    isWon: Math.random() > 0.35,
    profitMargin: parseFloat(randomBetween(0.25, 0.75).toFixed(2)),
    closeDate: randomCloseDate(),
    category: pick(CATEGORIES),
  }));
  return processSalesData(inbound);
}
