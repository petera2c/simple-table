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

// In the new format, we have a flat array where grouping is defined by the 'divisions' and 'teams' properties
// The rowGrouping prop will tell the table how to group: ["divisions", "teams"]
const rows = [
  // TechSolutions Inc. company
  {
    id: 1,
    organization: "TechSolutions Inc.",
    // Removed employees and budget - these should be aggregated from divisions/teams
    performance: "Exceeding",
    location: "San Francisco",
    growthRate: "+9%",
    status: "Expanding",
    established: "2018-01-01",
    divisions: [
      {
        id: 1,
        organization: "Engineering",
        // Removed employees and budget - these should be aggregated from teams
        performance: "Exceeding",
        location: "Multiple",
        growthRate: "+11%",
        status: "Expanding",
        established: "2018-01-15",
        teams: [
          {
            id: 1,
            organization: "Frontend",
            employees: 28,
            budget: "$2.8M",
            rating: 4.8,
            projectCount: 12,
            minTeamSize: 3,
            maxTeamSize: 28,
            weightedScore: 92.5,
            performance: "Exceeding",
            location: "San Francisco",
            status: "Hiring",
          },
          {
            id: 2,
            organization: "Backend",
            employees: 32,
            budget: "$3.4M",
            rating: 4.6,
            projectCount: 8,
            minTeamSize: 4,
            maxTeamSize: 32,
            weightedScore: 88.2,
            performance: "Meeting",
            location: "Seattle",
            status: "Stable",
          },
          {
            id: 3,
            organization: "DevOps",
            employees: 15,
            budget: "$1.9M",
            rating: 4.9,
            projectCount: 15,
            minTeamSize: 2,
            maxTeamSize: 15,
            weightedScore: 95.1,
            performance: "Exceeding",
            location: "Remote",
            status: "Hiring",
          },
          {
            id: 4,
            organization: "Mobile",
            employees: 22,
            budget: "$2.5M",
            rating: 4.3,
            projectCount: 6,
            minTeamSize: 3,
            maxTeamSize: 22,
            weightedScore: 82.7,
            performance: "Meeting",
            location: "Austin",
            status: "Restructuring",
          },
        ],
      },
      {
        id: 2,
        organization: "Product",
        // Removed employees and budget - these should be aggregated from teams
        performance: "Meeting",
        location: "Multiple",
        growthRate: "+5%",
        status: "Stable",
        established: "2019-01-10",
        teams: [
          {
            id: 1,
            organization: "Design",
            employees: 17,
            budget: "$1.8M",
            rating: 4.4,
            projectCount: 9,
            minTeamSize: 2,
            maxTeamSize: 17,
            weightedScore: 87.3,
            performance: "Meeting",
            location: "Portland",
            status: "Stable",
          },
          {
            id: 2,
            organization: "Research",
            employees: 9,
            budget: "$1.4M",
            rating: 4.1,
            projectCount: 4,
            minTeamSize: 1,
            maxTeamSize: 9,
            weightedScore: 74.6,
            performance: "Below Target",
            location: "Boston",
            status: "Reviewing",
          },
          {
            id: 3,
            organization: "QA Testing",
            employees: 14,
            budget: "$1.2M",
            rating: 4.5,
            projectCount: 11,
            minTeamSize: 2,
            maxTeamSize: 14,
            weightedScore: 85.9,
            performance: "Meeting",
            location: "Chicago",
            status: "Stable",
          },
        ],
      },
    ],
  },
  // HealthFirst Group company
  {
    id: 2,
    organization: "HealthFirst Group",
    // Removed employees and budget - these should be aggregated from divisions/teams
    performance: "Meeting",
    location: "Boston",
    growthRate: "+8%",
    status: "Stable",
    established: "2010-01-01",
    divisions: [
      {
        id: 1,
        organization: "Hospital Operations",
        // Removed employees and budget - these should be aggregated from teams
        performance: "Meeting",
        location: "Multiple",
        growthRate: "+6%",
        status: "Expanding",
        established: "2010-01-05",
        teams: [
          {
            id: 1,
            organization: "Emergency",
            employees: 48,
            budget: "$5.2M",
            rating: 4.7,
            projectCount: 3,
            minTeamSize: 8,
            maxTeamSize: 48,
            weightedScore: 91.4,
            performance: "Meeting",
            location: "New York",
            status: "Critical",
          },
          {
            id: 2,
            organization: "Cardiology",
            employees: 32,
            budget: "$4.8M",
            rating: 4.9,
            projectCount: 5,
            minTeamSize: 6,
            maxTeamSize: 32,
            weightedScore: 96.8,
            performance: "Exceeding",
            location: "Chicago",
            status: "Expanding",
          },
          {
            id: 3,
            organization: "Pediatrics",
            employees: 26,
            budget: "$3.1M",
            rating: 4.6,
            projectCount: 4,
            minTeamSize: 4,
            maxTeamSize: 26,
            weightedScore: 89.2,
            performance: "Meeting",
            location: "Boston",
            status: "Stable",
          },
        ],
      },
      {
        id: 2,
        organization: "Research & Development",
        // Removed employees and budget - these should be aggregated from teams
        performance: "Exceeding",
        location: "Multiple",
        growthRate: "+15%",
        status: "Hiring",
        established: "2017-01-10",
        teams: [
          {
            id: 1,
            organization: "Clinical Trials",
            employees: 18,
            budget: "$4.2M",
            rating: 4.8,
            projectCount: 7,
            minTeamSize: 3,
            maxTeamSize: 18,
            weightedScore: 93.5,
            performance: "Exceeding",
            location: "San Diego",
            status: "Expanding",
          },
          {
            id: 2,
            organization: "Genomics",
            employees: 14,
            budget: "$5.1M",
            rating: 5.0,
            projectCount: 8,
            minTeamSize: 2,
            maxTeamSize: 14,
            weightedScore: 98.2,
            performance: "Exceeding",
            location: "Cambridge",
            status: "Hiring",
          },
        ],
      },
    ],
  },
  // Global Finance company
  {
    id: 3,
    organization: "Global Finance",
    // Removed employees and budget - these should be aggregated from divisions/teams
    performance: "Meeting",
    location: "New York",
    growthRate: "+3%",
    status: "Restructuring",
    established: "2005-01-01",
    divisions: [
      {
        id: 1,
        organization: "Banking Operations",
        // Removed employees and budget - these should be aggregated from teams
        performance: "Meeting",
        location: "Multiple",
        growthRate: "+3%",
        status: "Stable",
        established: "2005-01-15",
        teams: [
          {
            id: 1,
            organization: "Retail Banking",
            employees: 56,
            budget: "$4.8M",
            performance: "Meeting",
            location: "New York",
            growthRate: "+2%",
            status: "Stable",
            established: "2005-11-08",
          },
          {
            id: 2,
            organization: "Investment",
            employees: 38,
            budget: "$7.2M",
            performance: "Exceeding",
            location: "Chicago",
            growthRate: "+11%",
            status: "Hiring",
            established: "2008-05-12",
          },
          {
            id: 3,
            organization: "Loans",
            employees: 27,
            budget: "$3.5M",
            performance: "Below Target",
            location: "Dallas",
            growthRate: "-3%",
            status: "Restructuring",
            established: "2010-03-17",
          },
        ],
      },
    ],
  },
  // Apex University
  {
    id: 4,
    organization: "Apex University",
    // Removed employees and budget - these should be aggregated from divisions/teams
    performance: "Meeting",
    location: "Cambridge",
    growthRate: "+6%",
    status: "Stable",
    established: "1992-01-01",
    divisions: [
      {
        id: 1,
        organization: "Academic Departments",
        // Removed employees and budget - these should be aggregated from teams
        performance: "Meeting",
        location: "Multiple",
        growthRate: "+6%",
        status: "Stable",
        established: "1992-01-15",
        teams: [
          {
            id: 1,
            organization: "Computer Science",
            employees: 35,
            budget: "$3.8M",
            performance: "Meeting",
            location: "Boston",
            growthRate: "+8%",
            status: "Expanding",
            established: "1998-08-24",
          },
          {
            id: 2,
            organization: "Business",
            employees: 42,
            budget: "$4.5M",
            performance: "Exceeding",
            location: "Chicago",
            growthRate: "+6%",
            status: "Stable",
            established: "1995-09-15",
          },
          {
            id: 3,
            organization: "Engineering",
            employees: 38,
            budget: "$5.1M",
            performance: "Meeting",
            location: "San Francisco",
            growthRate: "+4%",
            status: "Stable",
            established: "1992-02-11",
          },
        ],
      },
    ],
  },
  // Industrial Systems
  {
    id: 5,
    organization: "Industrial Systems",
    // Removed employees and budget - these should be aggregated from divisions/teams
    performance: "Meeting",
    location: "Detroit",
    growthRate: "+3%",
    status: "Stable",
    established: "2001-01-01",
    divisions: [
      {
        id: 1,
        organization: "Production",
        // Removed employees and budget - these should be aggregated from teams
        performance: "Meeting",
        location: "Multiple",
        growthRate: "+3%",
        status: "Stable",
        established: "2001-01-10",
        teams: [
          {
            id: 1,
            organization: "Assembly",
            employees: 78,
            budget: "$6.2M",
            performance: "Meeting",
            location: "Detroit",
            growthRate: "+2%",
            status: "Stable",
            established: "2001-05-18",
          },
          {
            id: 2,
            organization: "Quality Control",
            employees: 32,
            budget: "$2.8M",
            performance: "Exceeding",
            location: "Pittsburgh",
            growthRate: "+5%",
            status: "Hiring",
            established: "2003-11-24",
          },
          {
            id: 3,
            organization: "Logistics",
            employees: 42,
            budget: "$3.9M",
            performance: "Meeting",
            location: "Indianapolis",
            growthRate: "+3%",
            status: "Stable",
            established: "2005-02-08",
          },
        ],
      },
    ],
  },
  // Creative Media
  {
    id: 6,
    organization: "Creative Media",
    // Removed employees and budget - these should be aggregated from divisions/teams
    performance: "Exceeding",
    location: "Los Angeles",
    growthRate: "+14%",
    status: "Expanding",
    established: "2008-01-01",
    divisions: [
      {
        id: 1,
        organization: "Studio Operations",
        // Removed employees and budget - these should be aggregated from teams
        performance: "Exceeding",
        location: "Multiple",
        growthRate: "+14%",
        status: "Expanding",
        established: "2008-01-15",
        teams: [
          {
            id: 1,
            organization: "Production",
            employees: 64,
            budget: "$12.5M",
            performance: "Exceeding",
            location: "Los Angeles",
            growthRate: "+15%",
            status: "Expanding",
            established: "2008-07-22",
          },
          {
            id: 2,
            organization: "Post-Production",
            employees: 38,
            budget: "$8.2M",
            performance: "Meeting",
            location: "Vancouver",
            growthRate: "+9%",
            status: "Hiring",
            established: "2010-04-15",
          },
          {
            id: 3,
            organization: "Animation",
            employees: 52,
            budget: "$7.8M",
            performance: "Exceeding",
            location: "San Francisco",
            growthRate: "+18%",
            status: "Expanding",
            established: "2014-09-30",
          },
        ],
      },
    ],
  },
  // ShopSmart
  {
    id: 7,
    organization: "ShopSmart",
    // Removed employees and budget - these should be aggregated from divisions/teams
    performance: "Below Target",
    location: "Chicago",
    growthRate: "+2%",
    status: "Restructuring",
    established: "2009-01-01",
    divisions: [
      {
        id: 1,
        organization: "Store Operations",
        // Removed employees and budget - these should be aggregated from teams
        performance: "Meeting",
        location: "Multiple",
        growthRate: "+7%",
        status: "Stable",
        established: "2009-01-05",
        teams: [
          {
            id: 1,
            organization: "Sales",
            employees: 85,
            budget: "$4.2M",
            performance: "Below Target",
            location: "Multiple",
            growthRate: "-2%",
            status: "Restructuring",
            established: "2009-03-14",
          },
          {
            id: 2,
            organization: "Customer Support",
            employees: 42,
            budget: "$2.8M",
            performance: "Meeting",
            location: "Phoenix",
            growthRate: "+1%",
            status: "Stable",
            established: "2010-11-22",
          },
          {
            id: 3,
            organization: "Online Store",
            employees: 28,
            budget: "$3.5M",
            performance: "Exceeding",
            location: "Remote",
            growthRate: "+22%",
            status: "Expanding",
            established: "2018-06-05",
          },
        ],
      },
    ],
  },
  // Green Harvest
  {
    id: 8,
    organization: "Green Harvest",
    // Removed employees and budget - these should be aggregated from divisions/teams
    performance: "Meeting",
    location: "Iowa",
    growthRate: "+4%",
    status: "Stable",
    established: "2005-01-01",
    divisions: [
      {
        id: 1,
        organization: "Farming Operations",
        // Removed employees and budget - these should be aggregated from teams
        performance: "Meeting",
        location: "Multiple",
        growthRate: "+4%",
        status: "Stable",
        established: "2005-01-10",
        teams: [
          {
            id: 1,
            organization: "Crop Division",
            employees: 56,
            budget: "$5.1M",
            performance: "Meeting",
            location: "Iowa",
            growthRate: "+4%",
            status: "Stable",
            established: "2005-02-18",
          },
          {
            id: 2,
            organization: "Livestock",
            employees: 42,
            budget: "$4.8M",
            performance: "Below Target",
            location: "Nebraska",
            growthRate: "-1%",
            status: "Reviewing",
            established: "2007-05-22",
          },
          {
            id: 3,
            organization: "Research",
            employees: 18,
            budget: "$2.9M",
            performance: "Exceeding",
            location: "California",
            growthRate: "+9%",
            status: "Expanding",
            established: "2015-08-11",
          },
        ],
      },
    ],
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
        rowIdAccessor="id"
        // Default settings for this example
        columnResizing={props.columnResizing ?? true}
        height={props.height ?? "calc(100dvh - 112px)"}
        shouldPaginate
        rowsPerPage={10}
      />
    </>
  );
};

export default RowGroupingExample;
