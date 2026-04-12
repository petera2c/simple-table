// Self-contained demo table setup for this example.
import type { SolidHeaderObject } from "@simple-table/solid";


export const tableHeightHeaders: SolidHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", minWidth: 150, width: "1fr", type: "string" },
  { accessor: "email", label: "Email", minWidth: 200, width: "1fr", type: "string" },
  { accessor: "role", label: "Role", minWidth: 150, width: "1fr", type: "string" },
  { accessor: "department", label: "Department", minWidth: 150, width: "1fr", type: "string" },
  { accessor: "status", label: "Status", width: 120, type: "string" },
];

export const tableHeightData = [
  { id: 1, name: "Alice Chen", email: "alice@example.com", role: "Senior Engineer", department: "Engineering", status: "Active" },
  { id: 2, name: "Bob Martinez", email: "bob@example.com", role: "Product Manager", department: "Product", status: "Active" },
  { id: 3, name: "Carol Williams", email: "carol@example.com", role: "Designer", department: "Design", status: "Active" },
  { id: 4, name: "David Kim", email: "david@example.com", role: "Data Analyst", department: "Analytics", status: "Active" },
  { id: 5, name: "Eva Patel", email: "eva@example.com", role: "DevOps Engineer", department: "Engineering", status: "On Leave" },
  { id: 6, name: "Frank Johnson", email: "frank@example.com", role: "QA Lead", department: "Engineering", status: "Active" },
  { id: 7, name: "Grace Lee", email: "grace@example.com", role: "UX Researcher", department: "Design", status: "Active" },
  { id: 8, name: "Henry Brown", email: "henry@example.com", role: "Backend Developer", department: "Engineering", status: "Active" },
  { id: 9, name: "Iris Davis", email: "iris@example.com", role: "Frontend Developer", department: "Engineering", status: "Active" },
  { id: 10, name: "Jack Wilson", email: "jack@example.com", role: "Technical Writer", department: "Documentation", status: "Active" },
  { id: 11, name: "Kate Thompson", email: "kate@example.com", role: "Security Engineer", department: "Engineering", status: "Active" },
  { id: 12, name: "Leo Garcia", email: "leo@example.com", role: "ML Engineer", department: "AI", status: "Active" },
  { id: 13, name: "Mia Anderson", email: "mia@example.com", role: "Project Manager", department: "Operations", status: "Active" },
  { id: 14, name: "Noah Taylor", email: "noah@example.com", role: "Solutions Architect", department: "Engineering", status: "Active" },
  { id: 15, name: "Olivia Moore", email: "olivia@example.com", role: "HR Manager", department: "Human Resources", status: "Active" },
];

export const tableHeightConfig = {
  headers: tableHeightHeaders,
  rows: tableHeightData,
} as const;
