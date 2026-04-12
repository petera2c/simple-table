// Self-contained demo table setup for this example.
import type { ReactHeaderObject } from "@simple-table/react";


export const columnWidthHeaders: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "name", label: "Name", width: "1fr", minWidth: 120, type: "string" },
  { accessor: "email", label: "Email", width: "1fr", minWidth: 180, type: "string" },
  { accessor: "age", label: "Age", width: 80, type: "number" },
  { accessor: "department", label: "Department", width: "1fr", minWidth: 100, type: "string" },
  { accessor: "salary", label: "Salary", width: 120, align: "right", type: "number" },
];

export const columnWidthData = [
  { id: 1, name: "Alexandra Reeves", email: "alex.reeves@techstartup.io", age: 32, department: "AI Research", salary: "$145,000" },
  { id: 2, name: "Zephyr Kim", email: "zephyr.kim@techstartup.io", age: 28, department: "Product Design", salary: "$125,000" },
  { id: 3, name: "Phoenix Okafor", email: "phoenix.okafor@techstartup.io", age: 35, department: "Platform Engineering", salary: "$160,000" },
  { id: 4, name: "Luna Tanaka", email: "luna.tanaka@techstartup.io", age: 29, department: "DevOps & Infrastructure", salary: "$138,000" },
  { id: 5, name: "River Stone", email: "river.stone@techstartup.io", age: 31, department: "Growth Engineering", salary: "$142,000" },
  { id: 6, name: "Sage Morrison", email: "sage.morrison@techstartup.io", age: 27, department: "Customer Success", salary: "$95,000" },
  { id: 7, name: "Atlas Chen", email: "atlas.chen@techstartup.io", age: 33, department: "Security & Compliance", salary: "$155,000" },
  { id: 8, name: "Nova Patel", email: "nova.patel@techstartup.io", age: 30, department: "Data Science", salary: "$148,000" },
  { id: 9, name: "Isabella Patel", email: "isabella.patel@techstartup.io", age: 29, department: "Marketing", salary: "$130,000" },
  { id: 10, name: "Leo Patel", email: "leo.patel@techstartup.io", age: 30, department: "Sales", salary: "$125,000" },
  { id: 11, name: "Oliver Patel", email: "oliver.patel@techstartup.io", age: 31, department: "HR", salary: "$115,000" },
  { id: 12, name: "Sophia Patel", email: "sophia.patel@techstartup.io", age: 28, department: "Finance", salary: "$120,000" },
  { id: 13, name: "William Patel", email: "william.patel@techstartup.io", age: 32, department: "Marketing", salary: "$135,000" },
];

export const columnWidthConfig = {
  headers: columnWidthHeaders,
  rows: columnWidthData,
  tableProps: { columnResizing: true },
} as const;
