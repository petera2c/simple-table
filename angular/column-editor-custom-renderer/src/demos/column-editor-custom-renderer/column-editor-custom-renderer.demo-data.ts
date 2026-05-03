// Self-contained demo table setup for this example.
import type { AngularHeaderObject, Row } from "@simple-table/angular";


export const columnEditorCustomRendererData: Row[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Engineer", salary: 125000, department: "Engineering", status: "active" },
  { id: 2, name: "Bob Martinez", email: "bob@example.com", role: "Designer", salary: 98000, department: "Design", status: "active" },
  { id: 3, name: "Clara Chen", email: "clara@example.com", role: "PM", salary: 115000, department: "Product", status: "inactive" },
  { id: 4, name: "David Kim", email: "david@example.com", role: "Engineer", salary: 132000, department: "Engineering", status: "active" },
  { id: 5, name: "Elena Rossi", email: "elena@example.com", role: "Analyst", salary: 89000, department: "Analytics", status: "active" },
  { id: 6, name: "Frank Müller", email: "frank@example.com", role: "Engineer", salary: 118000, department: "Engineering", status: "inactive" },
  { id: 7, name: "Grace Park", email: "grace@example.com", role: "Designer", salary: 105000, department: "Design", status: "active" },
  { id: 8, name: "Henry Patel", email: "henry@example.com", role: "Lead", salary: 145000, department: "Engineering", status: "active" },
];

export const columnEditorCustomRendererHeaders: AngularHeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "name", label: "Name", width: 170, type: "string", isSortable: true },
  { accessor: "email", label: "Email", width: 200, type: "string" },
  { accessor: "role", label: "Role", width: 130, type: "string", isSortable: true },
  {
    accessor: "salary",
    label: "Salary",
    width: 130,
    type: "number",
    isSortable: true,
    valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
  },
  { accessor: "department", label: "Department", width: 140, type: "string", isSortable: true },
  { accessor: "status", label: "Status", width: 100, type: "string" },
];

export const columnEditorCustomRendererConfig = {
  headers: columnEditorCustomRendererHeaders,
  rows: columnEditorCustomRendererData,
  tableProps: {
    editColumns: true,
  },
} as const;

export const COLUMN_EDITOR_TEXT = "Manage Columns";
export const COLUMN_EDITOR_SEARCH_PLACEHOLDER = "Search columns…";
