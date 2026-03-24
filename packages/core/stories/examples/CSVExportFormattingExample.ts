/**
 * CSVExportFormatting Example – vanilla port of React CSVExportFormattingExample.
 * Same employee data, headers, valueFormatters, useFormattedValueForCSV, and exportValueGetter as React.
 */
import type { ExportValueProps, HeaderObject, Row, Theme } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

const ROWS: Row[] = [
  { id: 1, employeeName: "John Doe", email: "john.doe@company.com", annualSalary: 85000, monthlyBonus: 2500, completionRate: 0.92, startDate: "2020-03-15", department: "engineering", level: 3 },
  { id: 2, employeeName: "Jane Smith", email: "jane.smith@company.com", annualSalary: 95000, monthlyBonus: 3200, completionRate: 0.88, startDate: "2019-07-22", department: "product", level: 4 },
  { id: 3, employeeName: "Bob Johnson", email: "bob.johnson@company.com", annualSalary: 72000, monthlyBonus: 1800, completionRate: 0.95, startDate: "2021-11-10", department: "sales", level: 2 },
  { id: 4, employeeName: "Alice Williams", email: "alice.williams@company.com", annualSalary: 110000, monthlyBonus: 4500, completionRate: 0.91, startDate: "2018-01-08", department: "engineering", level: 5 },
  { id: 5, employeeName: "Charlie Brown", email: "charlie.brown@company.com", annualSalary: 68000, monthlyBonus: 1500, completionRate: 0.87, startDate: "2022-05-20", department: "marketing", level: 2 },
];

const HEADERS: HeaderObject[] = [
  { accessor: "employeeName", label: "Employee", width: 150, isSortable: true, type: "string" },
  { accessor: "email", label: "Email", width: 200, isSortable: true, type: "string" },
  {
    accessor: "annualSalary",
    label: "Annual Salary",
    width: 150,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }: { value?: unknown }) => {
      if (typeof value === "number") return `$${(value / 1000).toFixed(0)}K`;
      return String(value);
    },
    useFormattedValueForCSV: true,
    tooltip: "CSV export will show formatted value like '$85K'",
  },
  {
    accessor: "monthlyBonus",
    label: "Monthly Bonus",
    width: 150,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }: { value?: unknown }) => {
      if (typeof value === "number") return `$${value.toLocaleString()}`;
      return String(value);
    },
    useFormattedValueForCSV: false,
    tooltip: "CSV export will show raw numeric value",
  },
  {
    accessor: "completionRate",
    label: "Completion Rate",
    width: 150,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }: { value?: unknown }) => {
      if (typeof value === "number") return `${(value * 100).toFixed(1)}%`;
      return String(value);
    },
    exportValueGetter: ({ value, formattedValue }: ExportValueProps) => {
      if (typeof value === "number") return `${Math.round(value * 100)}%`;
      return String(formattedValue ?? value);
    },
    tooltip: "CSV export uses custom exportValueGetter (whole percentage)",
  },
  {
    accessor: "startDate",
    label: "Start Date",
    width: 140,
    isSortable: true,
    type: "date",
    valueFormatter: ({ value }: { value?: unknown }) => {
      if (typeof value === "string") {
        return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
      }
      return String(value);
    },
    useFormattedValueForCSV: true,
    tooltip: "CSV export shows formatted date",
  },
  {
    accessor: "department",
    label: "Department",
    width: 130,
    isSortable: true,
    type: "string",
    valueFormatter: ({ value }: { value?: unknown }) => {
      const str = String(value);
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    exportValueGetter: ({ value }: { value?: unknown }) => {
      const deptCodes: Record<string, string> = {
        engineering: "ENG",
        product: "PRD",
        sales: "SLS",
        marketing: "MKT",
      };
      const v = String(value ?? "");
      const code = deptCodes[v] || "OTH";
      const name = v.charAt(0).toUpperCase() + v.slice(1);
      return `${name} (${code})`;
    },
    tooltip: "CSV export adds department code using exportValueGetter",
  },
  {
    accessor: "level",
    label: "Level",
    width: 100,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }: { value?: unknown }) => {
      const levels = ["Intern", "Junior", "Mid", "Senior", "Lead", "Principal"];
      return levels[Number(value)] ?? String(value);
    },
    useFormattedValueForCSV: true,
    tooltip: "CSV export shows level name instead of number",
  },
];

export const csvExportFormattingExampleDefaults = {
  theme: "modern-light" as Theme,
  selectableCells: false,
  height: "500px",
};

export function renderCSVExportFormattingExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...csvExportFormattingExampleDefaults, ...args };
  const { wrapper, h2, tableContainer, table } = renderVanillaTable(HEADERS, ROWS, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "CSV Export with Custom Formatting";
  const desc = document.createElement("div");
  desc.style.marginTop = "10px";
  desc.style.fontSize = "14px";
  desc.style.lineHeight = "1.6";
  desc.style.marginBottom = "1rem";
  desc.style.color = "#333";
  desc.innerHTML = `
    <p><strong>This example demonstrates CSV export options:</strong></p>
    <ul>
      <li><strong>useFormattedValueForCSV:</strong> When true, the CSV export uses the formatted value from valueFormatter (e.g., "$85K" instead of 85000).</li>
      <li><strong>exportValueGetter:</strong> A custom function that can provide a completely different value for CSV export (e.g., adding department codes, rounding percentages).</li>
      <li><strong>Priority:</strong> exportValueGetter &gt; useFormattedValueForCSV &gt; raw value</li>
    </ul>
    <div style="margin-top: 15px; padding: 15px; background-color: #e8f5e9; border-radius: 4px;">
      <p><strong>Column behaviors in this example:</strong></p>
      <ul style="margin-top: 8px; margin-bottom: 0;">
        <li><strong>Annual Salary:</strong> Exports formatted "$85K" style</li>
        <li><strong>Monthly Bonus:</strong> Exports raw numbers</li>
        <li><strong>Completion Rate:</strong> Custom export function (whole percentages)</li>
        <li><strong>Department:</strong> Custom export adds codes like "Engineering (ENG)"</li>
        <li><strong>Level:</strong> Exports text like "Senior" instead of number</li>
      </ul>
    </div>
  `;
  wrapper.insertBefore(desc, tableContainer);
  const btn = document.createElement("button");
  btn.textContent = "Export to CSV";
  btn.type = "button";
  btn.style.marginBottom = "1rem";
  btn.style.padding = "10px 20px";
  btn.style.backgroundColor = "#1976d2";
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.borderRadius = "4px";
  btn.style.cursor = "pointer";
  btn.style.fontSize = "14px";
  btn.style.fontWeight = "600";
  wrapper.insertBefore(btn, tableContainer);
  btn.addEventListener("click", () => table.getAPI().exportToCSV({ filename: "employee-data.csv" }));
  return wrapper;
}
