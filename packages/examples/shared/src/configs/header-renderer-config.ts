import type { HeaderObject, Row } from "simple-table-core";

export const headerRendererData: Row[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Engineer", salary: 125000, department: "Engineering" },
  { id: 2, name: "Bob Martinez", email: "bob@example.com", role: "Designer", salary: 98000, department: "Design" },
  { id: 3, name: "Clara Chen", email: "clara@example.com", role: "PM", salary: 115000, department: "Product" },
  { id: 4, name: "David Kim", email: "david@example.com", role: "Engineer", salary: 132000, department: "Engineering" },
  { id: 5, name: "Elena Rossi", email: "elena@example.com", role: "Analyst", salary: 89000, department: "Analytics" },
  { id: 6, name: "Frank Müller", email: "frank@example.com", role: "Engineer", salary: 118000, department: "Engineering" },
  { id: 7, name: "Grace Park", email: "grace@example.com", role: "Designer", salary: 105000, department: "Design" },
  { id: 8, name: "Henry Patel", email: "henry@example.com", role: "Lead", salary: 145000, department: "Engineering" },
];

export const headerRendererHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number", isSortable: true },
  { accessor: "name", label: "Employee Name", width: 180, type: "string", isSortable: true },
  { accessor: "email", label: "Email Address", width: 200, type: "string" },
  { accessor: "role", label: "Job Role", width: 130, type: "string", isSortable: true },
  { accessor: "salary", label: "Annual Salary", width: 140, type: "number", isSortable: true },
  { accessor: "department", label: "Department", width: 150, type: "string", isSortable: true },
];

export const headerRendererConfig = {
  headers: headerRendererHeaders,
  rows: headerRendererData,
  tableProps: {
    selectableCells: true,
    columnResizing: true,
  },
} as const;
