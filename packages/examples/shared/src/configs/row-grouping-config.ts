import type { HeaderObject } from "simple-table-core";

export const rowGroupingData = [
  { id: 1, name: "Dr. Elena Vasquez", department: "AI Research", team: "NLP", role: "Lead Researcher", salary: 145000 },
  { id: 2, name: "Dr. Sarah Kim", department: "AI Research", team: "NLP", role: "Principal Scientist", salary: 165000 },
  { id: 3, name: "Wei Zhang", department: "AI Research", team: "Computer Vision", role: "Research Engineer", salary: 130000 },
  { id: 4, name: "Priya Chakraborty", department: "Engineering", team: "Backend", role: "Software Engineer", salary: 118000 },
  { id: 5, name: "Olumide Adebayo", department: "Engineering", team: "Backend", role: "Backend Developer", salary: 105000 },
  { id: 6, name: "Kai Tanaka", department: "Engineering", team: "Frontend", role: "Senior Designer", salary: 95000 },
  { id: 7, name: "Isabella Chen", department: "Engineering", team: "Frontend", role: "UI Developer", salary: 88000 },
  { id: 8, name: "Amara Okafor", department: "DevOps", team: "Infrastructure", role: "DevOps Engineer", salary: 125000 },
  { id: 9, name: "Dmitri Volkov", department: "DevOps", team: "Infrastructure", role: "SRE", salary: 135000 },
  { id: 10, name: "Santiago Rodriguez", department: "Marketing", team: "Growth", role: "Marketing Analyst", salary: 82000 },
  { id: 11, name: "Luca Rossi", department: "Marketing", team: "Content", role: "Content Writer", salary: 75000 },
  { id: 12, name: "Magnus Eriksson", department: "Product", team: "Platform", role: "Product Manager", salary: 110000 },
  { id: 13, name: "Zara Al-Rashid", department: "Sales", team: "Enterprise", role: "Sales Director", salary: 98000 },
  { id: 14, name: "Tomás Silva", department: "Sales", team: "Enterprise", role: "Account Executive", salary: 85000 },
];

export const rowGroupingHeaders: HeaderObject[] = [
  { accessor: "name", label: "Name", width: "1fr", minWidth: 120 },
  { accessor: "department", label: "Department", width: 150 },
  { accessor: "team", label: "Team", width: 150 },
  { accessor: "role", label: "Role", width: 180 },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
  },
];

export const rowGroupingConfig = {
  headers: rowGroupingHeaders,
  rows: rowGroupingData,
  tableProps: {
    rowGrouping: ["department", "team"] as string[],
    enableStickyParents: true,
    getRowId: ({ row }: { row: Record<string, unknown> }) => String(row.id),
    columnResizing: true,
  },
} as const;
