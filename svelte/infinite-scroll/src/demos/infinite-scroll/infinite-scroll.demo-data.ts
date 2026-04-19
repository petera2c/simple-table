// Self-contained demo table setup for this example.
import type { SvelteHeaderObject, Row } from "@simple-table/svelte";


const FIRST_NAMES = ["Elena", "Kai", "Amara", "Santiago", "Priya", "Magnus", "Zara", "Luca", "Sarah", "Olumide", "Isabella", "Dmitri"];
const LAST_NAMES = ["Vasquez", "Tanaka", "Okafor", "Rodriguez", "Chakraborty", "Eriksson", "Al-Rashid", "Rossi", "Kim", "Adebayo", "Chen", "Volkov"];
const DEPARTMENTS = ["Engineering", "AI Research", "UX Design", "DevOps", "Marketing", "Product", "Sales", "Finance"];

export function generateInfiniteScrollData(startIndex: number, count: number): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;
    const first = FIRST_NAMES[idx % FIRST_NAMES.length];
    const last = LAST_NAMES[idx % LAST_NAMES.length];
    rows.push({
      id: idx + 1,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@techcorp.com`,
      department: DEPARTMENTS[idx % DEPARTMENTS.length],
      salary: 60000 + Math.floor(((idx * 7919) % 100000)),
    });
  }
  return rows;
}

export const infiniteScrollHeaders: SvelteHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: "1fr", minWidth: 120 },
  { accessor: "email", label: "Email", width: 250 },
  { accessor: "department", label: "Department", width: 150 },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
  },
];

export const infiniteScrollConfig = {
  headers: infiniteScrollHeaders,
  rows: generateInfiniteScrollData(0, 30),
} as const;
