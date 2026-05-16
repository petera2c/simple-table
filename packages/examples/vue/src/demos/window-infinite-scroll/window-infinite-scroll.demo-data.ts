// Self-contained data + headers for the window-scroll infinite scroll example.
import type { VueHeaderObject, Row } from "@simple-table/vue";

const FIRST_NAMES = [
  "Elena",
  "Kai",
  "Amara",
  "Santiago",
  "Priya",
  "Magnus",
  "Zara",
  "Luca",
  "Sarah",
  "Olumide",
  "Isabella",
  "Dmitri",
  "Aiko",
  "Mateo",
  "Noor",
  "Fionn",
];

const LAST_NAMES = [
  "Vasquez",
  "Tanaka",
  "Okafor",
  "Rodriguez",
  "Chakraborty",
  "Eriksson",
  "Al-Rashid",
  "Rossi",
  "Kim",
  "Adebayo",
  "Chen",
  "Volkov",
  "Nakamura",
  "Silva",
  "Hassan",
  "O'Brien",
];

const DEPARTMENTS = [
  "Engineering",
  "AI Research",
  "UX Design",
  "DevOps",
  "Marketing",
  "Product",
  "Sales",
  "Finance",
  "Operations",
  "Customer Success",
];

const STATUSES = ["Active", "On Leave", "Remote", "Onsite"] as const;

export function generateWindowScrollRows(startIndex: number, count: number): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;
    const first = FIRST_NAMES[idx % FIRST_NAMES.length];
    const last = LAST_NAMES[(idx * 3) % LAST_NAMES.length];
    rows.push({
      id: idx + 1,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase().replace(/'/g, "")}@example.com`,
      department: DEPARTMENTS[idx % DEPARTMENTS.length],
      status: STATUSES[idx % STATUSES.length],
      tenureYears: 1 + ((idx * 13) % 18),
      salary: 60_000 + Math.floor(((idx * 7919) % 120_000)),
    });
  }
  return rows;
}

export const windowScrollHeaders: VueHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number", align: "right" },
  { accessor: "name", label: "Name", width: "1fr", minWidth: 160 },
  { accessor: "email", label: "Email", width: 260 },
  { accessor: "department", label: "Department", width: 160 },
  { accessor: "status", label: "Status", width: 120 },
  {
    accessor: "tenureYears",
    label: "Tenure",
    width: 110,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) => `${value} yrs`,
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 140,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
  },
];
