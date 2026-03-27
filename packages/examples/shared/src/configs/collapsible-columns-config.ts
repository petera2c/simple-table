import type { HeaderObject } from "simple-table-core";

export const collapsibleColumnsData = [
  { id: 1, name: "Dr. Elena Vasquez", age: 42, email: "elena.vasquez@techcorp.com", department: "AI Research", role: "Lead Researcher", salary: 145000, startDate: "2019-03-15" },
  { id: 2, name: "Kai Tanaka", age: 29, email: "k.tanaka@techcorp.com", department: "UX Design", role: "Senior Designer", salary: 95000, startDate: "2021-07-01" },
  { id: 3, name: "Amara Okafor", age: 35, email: "amara.okafor@techcorp.com", department: "DevOps", role: "DevOps Engineer", salary: 125000, startDate: "2020-01-20" },
  { id: 4, name: "Santiago Rodriguez", age: 27, email: "s.rodriguez@techcorp.com", department: "Marketing", role: "Marketing Analyst", salary: 82000, startDate: "2022-09-12" },
  { id: 5, name: "Priya Chakraborty", age: 33, email: "priya.c@techcorp.com", department: "Engineering", role: "Software Engineer", salary: 118000, startDate: "2020-06-01" },
  { id: 6, name: "Magnus Eriksson", age: 38, email: "magnus.erik@techcorp.com", department: "Product", role: "Product Manager", salary: 110000, startDate: "2018-11-30" },
  { id: 7, name: "Zara Al-Rashid", age: 31, email: "zara.alrashid@techcorp.com", department: "Sales", role: "Sales Director", salary: 98000, startDate: "2021-03-22" },
  { id: 8, name: "Luca Rossi", age: 26, email: "luca.rossi@techcorp.com", department: "Marketing", role: "Content Writer", salary: 75000, startDate: "2023-01-10" },
];

export const collapsibleColumnsHeaders: HeaderObject[] = [
  {
    accessor: "personal",
    label: "Personal Info",
    width: 400,
    collapsible: true,
    children: [
      { accessor: "name", label: "Name", width: "1fr", minWidth: 120 },
      { accessor: "age", label: "Age", width: 80, type: "number", showWhen: "parentExpanded" as const },
      { accessor: "email", label: "Email", width: 220, showWhen: "parentExpanded" as const },
    ],
  },
  {
    accessor: "work",
    label: "Work Info",
    width: 500,
    collapsible: true,
    children: [
      { accessor: "department", label: "Department", width: 150 },
      { accessor: "role", label: "Role", width: 180, showWhen: "parentExpanded" as const },
      {
        accessor: "salary",
        label: "Salary",
        width: 120,
        type: "number",
        align: "right",
        showWhen: "parentExpanded" as const,
        valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
      },
      { accessor: "startDate", label: "Start Date", width: 120, showWhen: "parentExpanded" as const },
    ],
  },
];

export const collapsibleColumnsConfig = {
  headers: collapsibleColumnsHeaders,
  rows: collapsibleColumnsData,
  tableProps: { columnResizing: true },
} as const;
