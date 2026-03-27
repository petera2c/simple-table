import type { HeaderObject } from "simple-table-core";

export const programmaticControlData = [
  { id: 1, name: "Dr. Elena Vasquez", age: 42, department: "AI Research", salary: 145000 },
  { id: 2, name: "Kai Tanaka", age: 29, department: "UX Design", salary: 95000 },
  { id: 3, name: "Amara Okafor", age: 35, department: "DevOps", salary: 125000 },
  { id: 4, name: "Santiago Rodriguez", age: 27, department: "Marketing", salary: 82000 },
  { id: 5, name: "Priya Chakraborty", age: 33, department: "Engineering", salary: 118000 },
  { id: 6, name: "Magnus Eriksson", age: 38, department: "Product", salary: 110000 },
  { id: 7, name: "Zara Al-Rashid", age: 31, department: "Sales", salary: 98000 },
  { id: 8, name: "Luca Rossi", age: 26, department: "Marketing", salary: 75000 },
  { id: 9, name: "Dr. Sarah Kim", age: 45, department: "AI Research", salary: 165000 },
  { id: 10, name: "Olumide Adebayo", age: 30, department: "Engineering", salary: 105000 },
  { id: 11, name: "Isabella Chen", age: 24, department: "UX Design", salary: 68000 },
  { id: 12, name: "Dmitri Volkov", age: 39, department: "DevOps", salary: 135000 },
];

export const programmaticControlHeaders: HeaderObject[] = [
  { accessor: "name", label: "Name", width: "1fr", minWidth: 120, isSortable: true, filterable: true, type: "string" },
  { accessor: "age", label: "Age", width: 100, isSortable: true, filterable: true, type: "number" },
  { accessor: "department", label: "Department", width: 150, isSortable: true, filterable: true, type: "string" },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    isSortable: true,
    filterable: true,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
  },
];

export const programmaticControlConfig = {
  headers: programmaticControlHeaders,
  rows: programmaticControlData,
  tableProps: { columnResizing: true },
} as const;
