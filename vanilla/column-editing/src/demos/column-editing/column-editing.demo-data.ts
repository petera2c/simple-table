// Self-contained demo table setup for this example.
import type { HeaderObject } from "simple-table-core";


export const columnEditingHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", minWidth: 120, width: "1fr", type: "string" },
  { accessor: "age", label: "Age", width: 100, type: "number" },
  { accessor: "role", label: "Role", width: 150, type: "string" },
  { accessor: "department", label: "Department", width: 150, type: "string" },
];

export const columnEditingData = [
  { id: 1, name: "Marcus Rodriguez", age: 29, role: "Frontend Developer", department: "Engineering", email: "marcus.rodriguez@company.com" },
  { id: 2, name: "Sophia Chen", age: 27, role: "UX/UI Designer", department: "Design", email: "sophia.chen@company.com" },
  { id: 3, name: "Raj Patel", age: 34, role: "Engineering Manager", department: "Management", email: "raj.patel@company.com" },
  { id: 4, name: "Luna Martinez", age: 23, role: "Junior Developer", department: "Engineering", email: "luna.martinez@company.com" },
  { id: 5, name: "Tyler Anderson", age: 31, role: "DevOps Engineer", department: "Operations", email: "tyler.anderson@company.com" },
  { id: 6, name: "Zara Kim", age: 28, role: "Product Designer", department: "Design", email: "zara.kim@company.com" },
  { id: 7, name: "Kai Thompson", age: 26, role: "Full Stack Developer", department: "Engineering", email: "kai.thompson@company.com" },
  { id: 8, name: "Ava Singh", age: 33, role: "Product Manager", department: "Product", email: "ava.singh@company.com" },
  { id: 9, name: "Jordan Walsh", age: 25, role: "Marketing Specialist", department: "Growth", email: "jordan.walsh@company.com" },
  { id: 10, name: "Phoenix Lee", age: 30, role: "Backend Developer", department: "Engineering", email: "phoenix.lee@company.com" },
  { id: 11, name: "River Jackson", age: 24, role: "Growth Designer", department: "Design", email: "river.jackson@company.com" },
  { id: 12, name: "Atlas Morgan", age: 32, role: "Tech Lead", department: "Engineering", email: "atlas.morgan@company.com" },
];

export const columnEditingConfig = {
  headers: columnEditingHeaders,
  rows: columnEditingData,
  tableProps: { enableHeaderEditing: true, selectableColumns: true },
} as const;
