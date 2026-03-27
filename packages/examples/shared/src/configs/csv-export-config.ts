import type { HeaderObject } from "simple-table-core";

export const csvExportData = [
  { id: 1, name: "Dr. Elena Vasquez", department: "AI Research", email: "elena.vasquez@techcorp.com", salary: 145000, startDate: "2019-03-15" },
  { id: 2, name: "Kai Tanaka", department: "UX Design", email: "k.tanaka@techcorp.com", salary: 95000, startDate: "2021-07-01" },
  { id: 3, name: "Amara Okafor", department: "DevOps", email: "amara.okafor@techcorp.com", salary: 125000, startDate: "2020-01-20" },
  { id: 4, name: "Santiago Rodriguez", department: "Marketing", email: "s.rodriguez@techcorp.com", salary: 82000, startDate: "2022-09-12" },
  { id: 5, name: "Priya Chakraborty", department: "Engineering", email: "priya.c@techcorp.com", salary: 118000, startDate: "2020-06-01" },
  { id: 6, name: "Magnus Eriksson", department: "Product", email: "magnus.erik@techcorp.com", salary: 110000, startDate: "2018-11-30" },
  { id: 7, name: "Zara Al-Rashid", department: "Sales", email: "zara.alrashid@techcorp.com", salary: 98000, startDate: "2021-03-22" },
  { id: 8, name: "Luca Rossi", department: "Marketing", email: "luca.rossi@techcorp.com", salary: 75000, startDate: "2023-01-10" },
  { id: 9, name: "Dr. Sarah Kim", department: "AI Research", email: "sarah.kim@techcorp.com", salary: 165000, startDate: "2017-08-15" },
  { id: 10, name: "Olumide Adebayo", department: "Engineering", email: "olumide.a@techcorp.com", salary: 105000, startDate: "2021-11-01" },
];

export const csvExportHeaders: HeaderObject[] = [
  { accessor: "name", label: "Name", width: "1fr", minWidth: 120 },
  { accessor: "department", label: "Department", width: 150 },
  { accessor: "email", label: "Email", width: 250 },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
  },
  { accessor: "startDate", label: "Start Date", width: 120 },
];

export const csvExportConfig = {
  headers: csvExportHeaders,
  rows: csvExportData,
  tableProps: { columnResizing: true },
} as const;
