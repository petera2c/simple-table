import type { HeaderObject } from "simple-table-core";
import type { SpreadsheetRow } from "../types/spreadsheet";

export function generateSpreadsheetData(count: number = 100): SpreadsheetRow[] {
  return Array.from({ length: count }, (_, i) => {
    const principal = Math.round((50000 + Math.random() * 450000) * 100) / 100;
    const interestRate = Math.round((2.5 + Math.random() * 5) * 100) / 100;
    const monthlyRate = interestRate / 100 / 12;
    const numMonths = 360;
    const monthlyPayment = monthlyRate > 0
      ? Math.round(((principal * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) / (Math.pow(1 + monthlyRate, numMonths) - 1)) * 100) / 100
      : Math.round((principal / numMonths) * 100) / 100;
    const paymentsMade = Math.floor(Math.random() * 120);
    const totalPaid = Math.round(monthlyPayment * paymentsMade * 100) / 100;
    let remainingBalance = principal;
    if (monthlyRate > 0) {
      remainingBalance = Math.round(principal * ((Math.pow(1 + monthlyRate, numMonths) - Math.pow(1 + monthlyRate, paymentsMade)) / (Math.pow(1 + monthlyRate, numMonths) - 1)) * 100) / 100;
    }
    const principalReduction = principal - Math.max(0, remainingBalance);
    const interestPaid = Math.round(Math.max(0, totalPaid - principalReduction) * 100) / 100;

    return {
      id: i + 1,
      principal,
      interestRate,
      monthlyPayment,
      remainingBalance: Math.max(0, remainingBalance),
      totalPaid,
      interestPaid,
    };
  });
}

export const spreadsheetData = generateSpreadsheetData(100);

export const spreadsheetHeaders: HeaderObject[] = [
  { accessor: "principal", label: "Principal", width: "1fr", minWidth: 100, align: "right", isEditable: true, type: "number", aggregation: { type: "sum" } },
  { accessor: "interestRate", label: "Interest Rate %", width: "1fr", minWidth: 110, align: "right", isEditable: true, type: "number", aggregation: { type: "average" } },
  { accessor: "monthlyPayment", label: "Monthly Payment", width: "1fr", minWidth: 120, align: "right", isEditable: true, type: "number", aggregation: { type: "sum" } },
  { accessor: "remainingBalance", label: "Remaining Balance", width: "1fr", minWidth: 130, align: "right", isEditable: true, type: "number", aggregation: { type: "sum" } },
  { accessor: "totalPaid", label: "Total Paid", width: "1fr", minWidth: 110, align: "right", isEditable: true, type: "number", aggregation: { type: "sum" } },
  { accessor: "interestPaid", label: "Interest Paid", width: "1fr", minWidth: 110, align: "right", isEditable: true, type: "number", aggregation: { type: "sum" } },
];

export function recalculateAmortization(item: SpreadsheetRow, accessor: string, newValue: string | number): SpreadsheetRow {
  const updatedItem = { ...item, [accessor]: newValue };
  if (!["principal", "interestRate", "monthlyPayment"].includes(accessor)) return updatedItem;

  const principal = accessor === "principal" ? parseFloat(String(newValue)) || 0 : item.principal;
  const interestRate = accessor === "interestRate" ? parseFloat(String(newValue)) || 0 : item.interestRate;
  let monthlyPayment = accessor === "monthlyPayment" ? parseFloat(String(newValue)) || 0 : item.monthlyPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numMonths = 360;

  if (accessor === "principal" || accessor === "interestRate") {
    if (monthlyRate > 0 && principal > 0) {
      monthlyPayment = parseFloat(((principal * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) / (Math.pow(1 + monthlyRate, numMonths) - 1)).toFixed(2));
      updatedItem.monthlyPayment = monthlyPayment;
    }
  }

  const totalPaidValue = typeof item.totalPaid === "number" ? item.totalPaid : 0;
  const estimatedPaymentsMade = Math.max(0, Math.min(120, Math.floor(totalPaidValue / monthlyPayment)));
  let remainingBalance = principal;
  if (monthlyRate > 0 && monthlyPayment > 0) {
    remainingBalance = principal * ((Math.pow(1 + monthlyRate, numMonths) - Math.pow(1 + monthlyRate, estimatedPaymentsMade)) / (Math.pow(1 + monthlyRate, numMonths) - 1));
  }
  const totalPaid = monthlyPayment * estimatedPaymentsMade;
  const principalReduction = principal - Math.max(0, remainingBalance);
  const interestPaid = totalPaid - principalReduction;

  updatedItem.remainingBalance = parseFloat(Math.max(0, remainingBalance).toFixed(2));
  updatedItem.totalPaid = parseFloat(totalPaid.toFixed(2));
  updatedItem.interestPaid = parseFloat(Math.max(0, interestPaid).toFixed(2));
  return updatedItem;
}

export const spreadsheetConfig = {
  headers: spreadsheetHeaders,
  rows: spreadsheetData,
} as const;
