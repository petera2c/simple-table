/**
 * RowGrouping Example – vanilla port of React row-grouping/RowGrouping.
 * Same headers, data (generateTeams/generateDivisions), and props as React version.
 */
import type { HeaderObject, Row } from "../../../src/index";
import { SimpleTableVanilla } from "../../../src/index";

const HEADERS: HeaderObject[] = [
  { accessor: "organization", label: "Organization", width: 200, expandable: true, type: "string" },
  { accessor: "employees", label: "Employees", width: 100, type: "number", aggregation: { type: "sum" } },
  {
    accessor: "budget",
    label: "Annual Budget",
    width: 140,
    type: "string",
    aggregation: {
      type: "sum",
      parseValue: (value: string) => {
        const n = parseFloat(String(value).replace(/[$M]/g, ""));
        return isNaN(n) ? 0 : n;
      },
    },
    valueFormatter: ({ value }: { value?: unknown }) =>
      typeof value === "number" ? `$${value.toFixed(1)}M` : typeof value === "string" ? value : "",
  },
  {
    accessor: "rating",
    label: "Team Rating",
    width: 100,
    type: "number",
    aggregation: { type: "average" },
    valueFormatter: ({ value }: { value?: unknown }) =>
      typeof value === "number" ? `${value.toFixed(1)} ⭐` : typeof value === "string" ? `${value} ⭐` : "",
  },
  { accessor: "projectCount", label: "Projects", width: 90, type: "number", aggregation: { type: "count" } },
  { accessor: "minTeamSize", label: "Min Team", width: 90, type: "number", aggregation: { type: "min" } },
  { accessor: "maxTeamSize", label: "Max Team", width: 90, type: "number", aggregation: { type: "max" } },
  {
    accessor: "weightedScore",
    label: "Score",
    width: 100,
    type: "number",
    aggregation: {
      type: "custom",
      customFn: (values: unknown[]) => {
        if (values.length === 0) return 0;
        const sum: number = values.reduce<number>((acc, val) => acc + (parseFloat(String(val)) || 0), 0);
        return Math.round((sum / values.length) * 10) / 10;
      },
    },
    valueFormatter: ({ value }: { value?: unknown }) =>
      typeof value === "number" || typeof value === "string" ? `${value}/100` : "",
  },
  { accessor: "performance", label: "Performance", width: 120, type: "string" },
  { accessor: "location", label: "Location", width: 130, type: "string" },
  { accessor: "status", label: "Status", width: 110, type: "string" },
];

function generateTeams(divisionId: number, count: number = 200): Row[] {
  const performances = ["Exceeding", "Meeting", "Below Target"];
  const statuses = ["Hiring", "Stable", "Restructuring", "Expanding", "Reviewing"];
  const locations = ["San Francisco", "Seattle", "Boston", "New York", "Austin", "Chicago", "Remote", "Portland", "Denver"];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    organization: `Team ${divisionId}-${i + 1}`,
    employees: Math.floor(Math.random() * 50) + 10,
    budget: `$${(Math.random() * 5 + 1).toFixed(1)}M`,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    projectCount: Math.floor(Math.random() * 15) + 1,
    minTeamSize: Math.floor(Math.random() * 5) + 1,
    maxTeamSize: Math.floor(Math.random() * 30) + 20,
    weightedScore: Math.round((Math.random() * 30 + 70) * 10) / 10,
    performance: performances[Math.floor(Math.random() * performances.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
}

function generateDivisions(companyId: number, count: number = 3): Row[] {
  const performances = ["Exceeding", "Meeting", "Below Target"];
  const statuses = ["Hiring", "Stable", "Restructuring", "Expanding"];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    organization: `Division ${companyId}-${i + 1}`,
    performance: performances[Math.floor(Math.random() * performances.length)],
    location: "Multiple",
    growthRate: `${Math.floor(Math.random() * 20) - 5}%`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    established: `20${Math.floor(Math.random() * 20) + 5}-01-15`,
    teams: generateTeams(i + 1, 200),
  }));
}

const ROWS: Row[] = [
  {
    id: 0,
    organization: "Company 1",
    performance: "Exceeding",
    location: "San Francisco",
    growthRate: "+10%",
    status: "Expanding",
    established: "2018-01-01",
  },
  {
    id: 1,
    organization: "TechSolutions Inc.",
    performance: "Exceeding",
    location: "San Francisco",
    growthRate: "+9%",
    status: "Expanding",
    established: "2018-01-01",
    divisions: generateDivisions(1, 3),
  },
  {
    id: 2,
    organization: "Global Finance",
    performance: "Meeting",
    location: "New York",
    growthRate: "+3%",
    status: "Restructuring",
    established: "2005-01-01",
    divisions: generateDivisions(2, 2),
  },
  {
    id: 3,
    organization: "Creative Media",
    performance: "Exceeding",
    location: "Los Angeles",
    growthRate: "+14%",
    status: "Expanding",
    established: "2008-01-01",
    divisions: generateDivisions(3, 2),
  },
];

export function renderRowGroupingExample(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.padding = "2rem";
  const btn = document.createElement("button");
  btn.textContent = "Export to CSV";
  btn.type = "button";
  btn.style.marginBottom = "1rem";
  wrapper.appendChild(btn);
  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);
  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: HEADERS as never,
    rows: ROWS as never,
    rowGrouping: ["divisions", "teams"],
    columnResizing: true,
    height: "calc(100dvh - 112px)",
    enableStickyParents: true,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  table.mount();
  btn.addEventListener("click", () => table.getAPI().exportToCSV());
  return wrapper;
}
