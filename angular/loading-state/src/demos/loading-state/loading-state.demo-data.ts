// Self-contained demo table setup for this example.
import type { AngularHeaderObject } from "@simple-table/angular";


export const loadingStateData = [
  { id: 1, name: "Dr. Elena Vasquez", age: 42, department: "AI Research", salary: 145000, status: "Active" },
  { id: 2, name: "Kai Tanaka", age: 29, department: "UX Design", salary: 95000, status: "Active" },
  { id: 3, name: "Amara Okafor", age: 35, department: "DevOps", salary: 125000, status: "On Leave" },
  { id: 4, name: "Santiago Rodriguez", age: 27, department: "Marketing", salary: 82000, status: "Active" },
  { id: 5, name: "Priya Chakraborty", age: 33, department: "Engineering", salary: 118000, status: "Active" },
  { id: 6, name: "Magnus Eriksson", age: 38, department: "Product", salary: 110000, status: "Inactive" },
  { id: 7, name: "Zara Al-Rashid", age: 31, department: "Sales", salary: 98000, status: "Active" },
  { id: 8, name: "Luca Rossi", age: 26, department: "Marketing", salary: 75000, status: "Active" },
];

export const loadingStateHeaders: AngularHeaderObject[] = [
  { accessor: "name", label: "Name", width: "1fr", minWidth: 120 },
  { accessor: "age", label: "Age", width: 80, type: "number" },
  { accessor: "department", label: "Department", width: 150 },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
  },
  { accessor: "status", label: "Status", width: 120 },
];

export const loadingStateConfig = {
  headers: loadingStateHeaders,
  rows: loadingStateData,
} as const;
