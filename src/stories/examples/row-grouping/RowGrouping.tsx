import SimpleTable from "../../../components/simple-table/SimpleTable";
import { HeaderObject, TableRefType } from "../../..";
import { UniversalTableProps } from "../StoryWrapper";
import { useRef } from "react";

// Default args specific to RowGrouping - exported for reuse in stories and tests
export const rowGroupingDefaults = {
  columnResizing: true,
  height: "calc(100dvh - 112px)",
};

const headers: HeaderObject[] = [
  { accessor: "organization", label: "Organization", width: 200, expandable: true, type: "string" },
  {
    accessor: "employees",
    label: "Employees",
    width: 100,
    type: "number",
    aggregation: { type: "sum" },
  },
  {
    accessor: "budget",
    label: "Annual Budget",
    width: 140,
    type: "string",
    aggregation: {
      type: "sum",
      parseValue: (value: string) => {
        // Parse values like "$15.0M" to numbers
        const numericValue = parseFloat(value.replace(/[$M]/g, ""));
        return isNaN(numericValue) ? 0 : numericValue;
      },
    },
    valueFormatter: ({ value }) => {
      if (typeof value === "number") {
        // This is an aggregated value, format as currency
        return `$${value.toFixed(1)}M`;
      }
      if (typeof value === "string") {
        // This is original string value, return as-is
        return value;
      }
      return "";
    },
  },
  {
    accessor: "rating",
    label: "Team Rating",
    width: 100,
    type: "number",
    aggregation: { type: "average" },
    valueFormatter: ({ value }) => {
      if (typeof value === "number") {
        return `${value.toFixed(1)} ⭐`;
      }
      if (typeof value === "string" || typeof value === "number") {
        return `${value} ⭐`;
      }
      return "";
    },
  },
  {
    accessor: "projectCount",
    label: "Projects",
    width: 90,
    type: "number",
    aggregation: { type: "count" },
  },
  {
    accessor: "minTeamSize",
    label: "Min Team",
    width: 90,
    type: "number",
    aggregation: { type: "min" },
  },
  {
    accessor: "maxTeamSize",
    label: "Max Team",
    width: 90,
    type: "number",
    aggregation: { type: "max" },
  },
  {
    accessor: "weightedScore",
    label: "Score",
    width: 100,
    type: "number",
    aggregation: {
      type: "custom",
      customFn: (values: any[]) => {
        // Custom aggregation: calculate weighted score based on employees and performance
        if (values.length === 0) return 0;
        const sum = values.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
        return Math.round((sum / values.length) * 10) / 10; // Round to 1 decimal
      },
    },
    valueFormatter: ({ value }) => {
      if (typeof value === "number" || typeof value === "string") {
        return `${value}/100`;
      }
      return "";
    },
  },
  { accessor: "performance", label: "Performance", width: 120, type: "string" },
  { accessor: "location", label: "Location", width: 130, type: "string" },
  { accessor: "status", label: "Status", width: 110, type: "string" },
];

// Helper function to generate teams
const generateTeams = (divisionId: number, count: number = 200) => {
  const performances = ["Exceeding", "Meeting", "Below Target"];
  const statuses = ["Hiring", "Stable", "Restructuring", "Expanding", "Reviewing"];
  const locations = [
    "San Francisco",
    "Seattle",
    "Boston",
    "New York",
    "Austin",
    "Chicago",
    "Remote",
    "Portland",
    "Denver",
  ];

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
};

// Helper function to generate divisions
const generateDivisions = (companyId: number, count: number = 3) => {
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
};

// Generate rows with divisions and teams
const rows = [
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

const RowGroupingExample = (props: UniversalTableProps) => {
  const tableRef = useRef<TableRefType>(null);
  return (
    <>
      <button onClick={() => tableRef.current?.exportToCSV()}>Export to CSV</button>
      <SimpleTable
        {...props}
        tableRef={tableRef}
        defaultHeaders={headers}
        rows={rows}
        rowGrouping={["divisions", "teams"]}
        // Default settings for this example
        columnResizing={props.columnResizing ?? true}
        height={props.height ?? "calc(100dvh - 112px)"}
        enableStickyParents={true}
        // shouldPaginate
        // rowsPerPage={10}
      />
    </>
  );
};

export default RowGroupingExample;
