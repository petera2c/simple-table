// Self-contained demo table setup for this example.
import type { ReactHeaderObject, Row } from "@simple-table/react";


export const valueFormatterData: Row[] = [
  { id: 1, firstName: "Isabella", lastName: "Romano", salary: 125000, joinDate: "2021-03-15", performanceScore: 0.945, balance: 1250.50, department: "Engineering" },
  { id: 2, firstName: "Ethan", lastName: "McKenzie", salary: 98500, joinDate: "2022-07-22", performanceScore: 0.875, balance: -150.00, department: "Marketing" },
  { id: 3, firstName: "Zoe", lastName: "Patterson", salary: 110000, joinDate: "2020-01-10", performanceScore: 0.923, balance: 0, department: "Sales" },
  { id: 4, firstName: "Felix", lastName: "Chang", salary: 135000, joinDate: "2019-11-05", performanceScore: 0.967, balance: 3450.75, department: "Engineering" },
  { id: 5, firstName: "Aria", lastName: "Gonzalez", salary: 92000, joinDate: "2023-02-14", performanceScore: 0.834, balance: 780.25, department: "Design" },
  { id: 6, firstName: "Jasper", lastName: "Flynn", salary: 118000, joinDate: "2021-09-30", performanceScore: 0.891, balance: -425.50, department: "Product" },
  { id: 7, firstName: "Nova", lastName: "Sterling", salary: 105000, joinDate: "2022-04-18", performanceScore: 0.912, balance: 1850.00, department: "Marketing" },
  { id: 8, firstName: "Cruz", lastName: "Martinez", salary: 88500, joinDate: "2023-08-07", performanceScore: 0.798, balance: 245.75, department: "Operations" },
  { id: 9, firstName: "Sage", lastName: "Thompson", salary: 142000, joinDate: "2018-05-20", performanceScore: 0.978, balance: 5620.30, department: "Engineering" },
  { id: 10, firstName: "River", lastName: "Davis", salary: 95000, joinDate: "2022-11-12", performanceScore: 0.856, balance: 0, department: "Sales" },
  { id: 11, firstName: "Phoenix", lastName: "Williams", salary: 128000, joinDate: "2020-06-25", performanceScore: 0.934, balance: 2340.50, department: "Product" },
  { id: 12, firstName: "Atlas", lastName: "Johnson", salary: 102000, joinDate: "2023-01-09", performanceScore: 0.867, balance: -89.25, department: "Design" },
];

const DEPARTMENT_CODES: Record<string, string> = {
  engineering: "ENG",
  marketing: "MKT",
  sales: "SLS",
  product: "PRD",
  design: "DSN",
  operations: "OPS",
};

export const valueFormatterHeaders: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  {
    accessor: "firstName",
    label: "Name",
    width: 180,
    type: "string",
    valueFormatter: ({ value, row }) => {
      return `${value as string} ${row.lastName as string}`;
    },
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 140,
    type: "number",
    valueFormatter: ({ value }) => {
      return `$${(value as number).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    useFormattedValueForClipboard: true,
    useFormattedValueForCSV: true,
  },
  {
    accessor: "joinDate",
    label: "Join Date",
    width: 140,
    type: "date",
    valueFormatter: ({ value }) => {
      const date = new Date(value as string);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    },
  },
  {
    accessor: "performanceScore",
    label: "Performance",
    width: 130,
    type: "number",
    valueFormatter: ({ value }) => `${((value as number) * 100).toFixed(1)}%`,
    useFormattedValueForClipboard: true,
    exportValueGetter: ({ value }) => `${Math.round((value as number) * 100)}%`,
  },
  {
    accessor: "balance",
    label: "Balance",
    width: 120,
    type: "number",
    valueFormatter: ({ value }) => {
      const balance = value as number;
      if (balance === 0) return "\u2014";
      if (balance < 0) return `($${Math.abs(balance).toFixed(2)})`;
      return `$${balance.toFixed(2)}`;
    },
  },
  {
    accessor: "department",
    label: "Department",
    width: 150,
    type: "string",
    valueFormatter: ({ value }) => (value as string).toUpperCase(),
    exportValueGetter: ({ value }) => {
      const str = (value as string).toLowerCase();
      const code = DEPARTMENT_CODES[str] || "OTH";
      return `${(value as string).toUpperCase()} (${code})`;
    },
  },
];

export const valueFormatterConfig = {
  headers: valueFormatterHeaders,
  rows: valueFormatterData,
  tableProps: {
    selectableCells: true,
  },
} as const;
