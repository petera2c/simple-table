import type { HeaderObject } from "simple-table-core";

export const rowSelectionData = [
  { id: 1, name: "Dr. Elena Vasquez", role: "Lead Researcher", department: "AI Research", email: "elena.vasquez@techcorp.com", salary: 145000 },
  { id: 2, name: "Kai Tanaka", role: "Senior Designer", department: "UX Design", email: "k.tanaka@techcorp.com", salary: 95000 },
  { id: 3, name: "Amara Okafor", role: "DevOps Engineer", department: "DevOps", email: "amara.okafor@techcorp.com", salary: 125000 },
  { id: 4, name: "Santiago Rodriguez", role: "Marketing Analyst", department: "Marketing", email: "s.rodriguez@techcorp.com", salary: 82000 },
  { id: 5, name: "Priya Chakraborty", role: "Software Engineer", department: "Engineering", email: "priya.c@techcorp.com", salary: 118000 },
  { id: 6, name: "Magnus Eriksson", role: "Product Manager", department: "Product", email: "magnus.erik@techcorp.com", salary: 110000 },
  { id: 7, name: "Zara Al-Rashid", role: "Sales Director", department: "Sales", email: "zara.alrashid@techcorp.com", salary: 98000 },
  { id: 8, name: "Luca Rossi", role: "Content Writer", department: "Marketing", email: "luca.rossi@techcorp.com", salary: 75000 },
  { id: 9, name: "Dr. Sarah Kim", role: "Principal Scientist", department: "AI Research", email: "sarah.kim@techcorp.com", salary: 165000 },
  { id: 10, name: "Olumide Adebayo", role: "Backend Developer", department: "Engineering", email: "olumide.a@techcorp.com", salary: 105000 },
];

export const rowSelectionHeaders: HeaderObject[] = [
  { accessor: "name", label: "Name", width: "1fr", minWidth: 120 },
  { accessor: "role", label: "Role", width: 180 },
  { accessor: "department", label: "Department", width: 150 },
  { accessor: "email", label: "Email", width: 220 },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
  },
];

export const rowSelectionConfig = {
  headers: rowSelectionHeaders,
  rows: rowSelectionData,
} as const;
