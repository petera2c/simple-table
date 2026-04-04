// Self-contained demo table setup for this example.
import type { HeaderObject } from "@simple-table/solid";


export const externalSortData = [
  { id: 1, name: "Dr. Elena Vasquez", age: 42, email: "elena.vasquez@techcorp.com", salary: 145000, department: "AI Research" },
  { id: 2, name: "Kai Tanaka", age: 29, email: "k.tanaka@techcorp.com", salary: 95000, department: "UX Design" },
  { id: 3, name: "Amara Okafor", age: 35, email: "amara.okafor@techcorp.com", salary: 125000, department: "DevOps" },
  { id: 4, name: "Santiago Rodriguez", age: 27, email: "s.rodriguez@techcorp.com", salary: 82000, department: "Marketing" },
  { id: 5, name: "Priya Chakraborty", age: 33, email: "priya.c@techcorp.com", salary: 118000, department: "Engineering" },
  { id: 6, name: "Magnus Eriksson", age: 38, email: "magnus.erik@techcorp.com", salary: 110000, department: "Product" },
  { id: 7, name: "Zara Al-Rashid", age: 31, email: "zara.alrashid@techcorp.com", salary: 98000, department: "Sales" },
  { id: 8, name: "Luca Rossi", age: 26, email: "luca.rossi@techcorp.com", salary: 75000, department: "Marketing" },
  { id: 9, name: "Dr. Sarah Kim", age: 45, email: "sarah.kim@techcorp.com", salary: 165000, department: "AI Research" },
  { id: 10, name: "Olumide Adebayo", age: 30, email: "olumide.a@techcorp.com", salary: 105000, department: "Engineering" },
  { id: 11, name: "Isabella Chen", age: 24, email: "isabella.chen@techcorp.com", salary: 68000, department: "UX Design" },
  { id: 12, name: "Dmitri Volkov", age: 39, email: "dmitri.volkov@techcorp.com", salary: 135000, department: "DevOps" },
];

export const externalSortHeaders: HeaderObject[] = [
  { accessor: "name", label: "Name", width: "1fr", minWidth: 120, isSortable: true, type: "string" },
  { accessor: "age", label: "Age", width: 120, isSortable: true, type: "number" },
  { accessor: "department", label: "Department", width: 150, isSortable: true, type: "string" },
  { accessor: "email", label: "Email", width: 200, isSortable: true, type: "string" },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    isSortable: true,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
  },
];

export const externalSortConfig = {
  headers: externalSortHeaders,
  rows: externalSortData,
  tableProps: { externalSortHandling: true, columnResizing: true },
} as const;
