/**
 * RowGrouping Example – vanilla port of React row-grouping/RowGrouping.
 */
import { SimpleTableVanilla } from "../../../dist/index.es.js";

const HEADERS: Record<string, unknown>[] = [
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
    valueFormatter: ({ value }: { value?: unknown }) => (typeof value === "number" ? `${value.toFixed(1)} ⭐` : ""),
  },
  { accessor: "projectCount", label: "Projects", width: 90, type: "number", aggregation: { type: "count" } },
  { accessor: "minTeamSize", label: "Min Team", width: 90, type: "number", aggregation: { type: "min" } },
  { accessor: "maxTeamSize", label: "Max Team", width: 90, type: "number", aggregation: { type: "max" } },
  { accessor: "performance", label: "Performance", width: 120, type: "string" },
  { accessor: "location", label: "Location", width: 130, type: "string" },
  { accessor: "status", label: "Status", width: 110, type: "string" },
];

const ROWS: Record<string, unknown>[] = [
  {
    id: 0,
    organization: "Company 1",
    performance: "Exceeding",
    location: "San Francisco",
    status: "Expanding",
    employees: 100,
    budget: "$5.0M",
    rating: 4.2,
    projectCount: 10,
    minTeamSize: 2,
    maxTeamSize: 25,
  },
  {
    id: 1,
    organization: "TechSolutions Inc.",
    performance: "Exceeding",
    location: "San Francisco",
    status: "Expanding",
    employees: 250,
    budget: "$12.5M",
    rating: 4.5,
    projectCount: 20,
    minTeamSize: 3,
    maxTeamSize: 30,
  },
  {
    id: 2,
    organization: "Global Finance",
    performance: "Meeting",
    location: "New York",
    status: "Restructuring",
    employees: 500,
    budget: "$25.0M",
    rating: 4.0,
    projectCount: 35,
    minTeamSize: 5,
    maxTeamSize: 50,
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
    defaultHeaders: HEADERS,
    rows: ROWS,
    rowGrouping: ["organization"],
    columnResizing: true,
    height: "calc(100dvh - 112px)",
    enableStickyParents: true,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  table.mount();
  btn.addEventListener("click", () => table.getAPI().exportToCSV());
  return wrapper;
}
