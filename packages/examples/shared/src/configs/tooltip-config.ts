import type { HeaderObject, Row } from "simple-table-core";

export const tooltipData: Row[] = [
  { id: 1, name: "Alice Johnson", email: "alice.johnson@company.com", salary: 125000, startDate: "2021-03-15", department: "Engineering" },
  { id: 2, name: "Bob Martinez", email: "bob.martinez@company.com", salary: 98500, startDate: "2022-07-22", department: "Marketing" },
  { id: 3, name: "Clara Chen", email: "clara.chen@company.com", salary: 110000, startDate: "2020-01-10", department: "Sales" },
  { id: 4, name: "David Kim", email: "david.kim@company.com", salary: 135000, startDate: "2019-11-05", department: "Engineering" },
  { id: 5, name: "Elena Rossi", email: "elena.rossi@company.com", salary: 92000, startDate: "2023-02-14", department: "Design" },
  { id: 6, name: "Frank Müller", email: "frank.muller@company.com", salary: 118000, startDate: "2021-09-30", department: "Product" },
  { id: 7, name: "Grace Park", email: "grace.park@company.com", salary: 105000, startDate: "2022-04-18", department: "Marketing" },
  { id: 8, name: "Henry Patel", email: "henry.patel@company.com", salary: 142000, startDate: "2018-05-20", department: "Engineering" },
];

export const tooltipHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number", tooltip: "Unique employee identifier" },
  { accessor: "name", label: "Name", width: 180, type: "string", tooltip: "Full legal name" },
  { accessor: "email", label: "Email", width: 220, type: "string", tooltip: "Corporate email address" },
  {
    accessor: "salary",
    label: "Salary",
    width: 130,
    type: "number",
    tooltip: "Annual compensation (USD)",
    isSortable: true,
    valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
  },
  {
    accessor: "startDate",
    label: "Start Date",
    width: 140,
    type: "date",
    tooltip: "Date when the employee joined",
    isSortable: true,
    valueFormatter: ({ value }) => new Date(value as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  },
  { accessor: "department", label: "Department", width: 140, type: "string", tooltip: "Current department assignment", isSortable: true },
];

export const tooltipConfig = {
  headers: tooltipHeaders,
  rows: tooltipData,
  tableProps: {
    selectableCells: true,
  },
} as const;
