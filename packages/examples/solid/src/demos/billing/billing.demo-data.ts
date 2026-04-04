// Self-contained demo table setup for this example.
import type { HeaderObject } from "@simple-table/solid";

export interface BillingRow {
  id: string | number;
  name: string;
  type: string;
  amount: number;
  deferredRevenue: number;
  recognizedRevenue: number;
  invoices?: BillingRow[];
  charges?: BillingRow[];
  [key: `balance_${string}`]: number;
  [key: `revenue_${string}`]: number;
}


const ACCOUNT_NAMES = ["Acme Corp", "Globex Inc", "Initech", "Soylent Corp", "Umbrella LLC", "Wayne Industries", "Stark Tech", "Oscorp", "LexCorp", "Cyberdyne"];
const INVOICE_PREFIXES = ["INV", "SUB", "REN"];
const CHARGE_TYPES = ["Subscription", "API Usage", "Storage", "Support Premium", "Bandwidth", "Compute"];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function generateMonthlyData(): Record<string, number> {
  const data: Record<string, number> = {};
  const year = 2024;
  for (let m = 0; m < 12; m++) {
    const mo = months[m];
    const base = Math.round((1000 + Math.random() * 50000) * 100) / 100;
    data[`balance_${mo}_${year}`] = base;
    data[`revenue_${mo}_${year}`] = Math.round(base * (0.6 + Math.random() * 0.3) * 100) / 100;
  }
  return data;
}

export function generateBillingData(count: number = 30): BillingRow[] {
  const rows: BillingRow[] = [];
  for (let i = 0; i < count; i++) {
    const accountName = ACCOUNT_NAMES[i % ACCOUNT_NAMES.length];
    const totalAmount = Math.round((5000 + Math.random() * 200000) * 100) / 100;
    const recognized = Math.round(totalAmount * (0.3 + Math.random() * 0.5) * 100) / 100;
    const invoices: BillingRow[] = [];
    const invoiceCount = 2 + Math.floor(Math.random() * 3);
    for (let j = 0; j < invoiceCount; j++) {
      const invAmount = Math.round((totalAmount / invoiceCount) * 100) / 100;
      const invRecognized = Math.round(invAmount * (0.4 + Math.random() * 0.4) * 100) / 100;
      const charges: BillingRow[] = [];
      const chargeCount = 1 + Math.floor(Math.random() * 3);
      for (let k = 0; k < chargeCount; k++) {
        const chargeAmount = Math.round((invAmount / chargeCount) * 100) / 100;
        charges.push({
          id: `${i + 1}-inv${j + 1}-chg${k + 1}`,
          name: CHARGE_TYPES[k % CHARGE_TYPES.length],
          type: "charge",
          amount: chargeAmount,
          deferredRevenue: Math.round(chargeAmount * 0.3 * 100) / 100,
          recognizedRevenue: Math.round(chargeAmount * 0.7 * 100) / 100,
          ...generateMonthlyData(),
        });
      }
      invoices.push({
        id: `${i + 1}-inv${j + 1}`,
        name: `${INVOICE_PREFIXES[j % 3]}-${String(i * 10 + j + 1).padStart(4, "0")}`,
        type: "invoice",
        amount: invAmount,
        deferredRevenue: Math.round((invAmount - invRecognized) * 100) / 100,
        recognizedRevenue: invRecognized,
        charges,
        ...generateMonthlyData(),
      });
    }
    rows.push({
      id: i + 1,
      name: accountName,
      type: "account",
      amount: totalAmount,
      deferredRevenue: Math.round((totalAmount - recognized) * 100) / 100,
      recognizedRevenue: recognized,
      invoices,
      ...generateMonthlyData(),
    });
  }
  return rows;
}

export const billingData = generateBillingData(30);

function generateMonthHeaders(): HeaderObject[] {
  const headers: HeaderObject[] = [];
  const year = 2024;
  for (let monthIndex = 11; monthIndex >= 0; monthIndex--) {
    const fullMonthName = new Date(year, monthIndex).toLocaleString("default", { month: "long" });
    const mo = months[monthIndex];
    headers.push({
      accessor: `month_${mo}_${year}`,
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
          accessor: `balance_${mo}_${year}`,
          width: 200,
          isSortable: true,
          isEditable: false,
          align: "right",
          type: "number",
          aggregation: { type: "sum" },
          valueFormatter: ({ value }) => {
            if (typeof value !== "number" || value === 0) return "—";
            return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          },
        },
        {
          disableReorder: true,
          label: "Revenue",
          accessor: `revenue_${mo}_${year}`,
          width: 200,
          isSortable: true,
          isEditable: false,
          align: "right",
          type: "number",
          aggregation: { type: "sum" },
          valueFormatter: ({ value }) => {
            if (typeof value !== "number" || value === 0) return "—";
            return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          },
        },
      ],
    });
  }
  return headers;
}

export const billingHeaders: HeaderObject[] = [
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
      if (typeof value !== "number" || value === 0) return "—";
      return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
    valueFormatter: ({ value }) => {
      if (typeof value !== "number" || value === 0) return "—";
      return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
    valueFormatter: ({ value }) => {
      if (typeof value !== "number" || value === 0) return "—";
      return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
  },
  ...generateMonthHeaders(),
];

export const billingConfig = {
  headers: billingHeaders,
  rows: billingData,
} as const;
