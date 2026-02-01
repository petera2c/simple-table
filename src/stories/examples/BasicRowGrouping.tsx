import { useRef } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import { HeaderObject, TableRefType } from "../..";
import { UniversalTableProps } from "./StoryWrapper";

const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 100, type: "string" },
  { accessor: "organization", label: "Organization", width: 200, expandable: true, type: "string" },
  { accessor: "employees", label: "Employees", width: 100, type: "number" },
  { accessor: "budget", label: "Annual Budget", width: 140, type: "string" },
  { accessor: "performance", label: "Performance", width: 120, type: "string" },
  { accessor: "location", label: "Location", width: 130, type: "string" },
  { accessor: "growthRate", label: "Growth", width: 90, type: "string" },
  { accessor: "status", label: "Status", width: 110, type: "string" },
  { accessor: "established", label: "Est. Date", width: 110, type: "date" },
];

// Flat hierarchical data structure using divisions -> departments
const rows = [
  // TechSolutions Inc.
  {
    id: "company-1",
    organization: "TechSolutions Inc.",
    employees: 137,
    budget: "$15.0M",
    performance: "Exceeding",
    location: "San Francisco",
    growthRate: "+9%",
    status: "Expanding",
    established: "2018-01-01",
    divisions: [
      {
        id: "div-100",
        organization: "Engineering Division",
        employees: 97,
        budget: "$10.6M",
        performance: "Exceeding",
        location: "Multiple",
        growthRate: "+11%",
        status: "Expanding",
        established: "2018-01-15",
        departments: [
          {
            id: "dept-1001",
            organization: "Frontend",
            employees: 28,
            budget: "$2.8M",
            performance: "Exceeding",
            location: "San Francisco",
            growthRate: "+12%",
            status: "Hiring",
            established: "2019-05-16",
          },
          {
            id: "dept-1002",
            organization: "Backend",
            employees: 32,
            budget: "$3.4M",
            performance: "Meeting",
            location: "Seattle",
            growthRate: "+8%",
            status: "Stable",
            established: "2018-03-22",
          },
          {
            id: "dept-1003",
            organization: "DevOps",
            employees: 15,
            budget: "$1.9M",
            performance: "Exceeding",
            location: "Remote",
            growthRate: "+15%",
            status: "Hiring",
            established: "2020-11-05",
          },
          {
            id: "dept-1004",
            organization: "Mobile",
            employees: 22,
            budget: "$2.5M",
            performance: "Meeting",
            location: "Austin",
            growthRate: "+10%",
            status: "Restructuring",
            established: "2019-08-12",
          },
        ],
      },
      {
        id: "div-101",
        organization: "Product Division",
        employees: 40,
        budget: "$4.4M",
        performance: "Meeting",
        location: "Multiple",
        growthRate: "+5%",
        status: "Stable",
        established: "2019-01-10",
        departments: [
          {
            id: "dept-1101",
            organization: "Design",
            employees: 17,
            budget: "$1.8M",
            performance: "Meeting",
            location: "Portland",
            growthRate: "+6%",
            status: "Stable",
            established: "2019-02-28",
          },
          {
            id: "dept-1102",
            organization: "Research",
            employees: 9,
            budget: "$1.4M",
            performance: "Below Target",
            location: "Boston",
            growthRate: "+3%",
            status: "Reviewing",
            established: "2020-07-15",
          },
          {
            id: "dept-1103",
            organization: "QA Testing",
            employees: 14,
            budget: "$1.2M",
            performance: "Meeting",
            location: "Chicago",
            growthRate: "+5%",
            status: "Stable",
            established: "2019-11-01",
          },
        ],
      },
    ],
  },
  // HealthFirst Group
  {
    id: "company-2",
    organization: "HealthFirst Group",
    employees: 138,
    budget: "$22.4M",
    performance: "Meeting",
    location: "Boston",
    growthRate: "+8%",
    status: "Stable",
    established: "2010-01-01",
    divisions: [
      {
        id: "div-200",
        organization: "Hospital Operations",
        employees: 106,
        budget: "$13.1M",
        performance: "Meeting",
        location: "Multiple",
        growthRate: "+6%",
        status: "Expanding",
        established: "2010-01-05",
        departments: [
          {
            id: "dept-2001",
            organization: "Emergency",
            employees: 48,
            budget: "$5.2M",
            performance: "Meeting",
            location: "New York",
            growthRate: "+4%",
            status: "Critical",
            established: "2010-06-14",
          },
          {
            id: "dept-2002",
            organization: "Cardiology",
            employees: 32,
            budget: "$4.8M",
            performance: "Exceeding",
            location: "Chicago",
            growthRate: "+9%",
            status: "Expanding",
            established: "2012-03-25",
          },
          {
            id: "dept-2003",
            organization: "Pediatrics",
            employees: 26,
            budget: "$3.1M",
            performance: "Meeting",
            location: "Boston",
            growthRate: "+7%",
            status: "Stable",
            established: "2014-08-30",
          },
        ],
      },
      {
        id: "div-201",
        organization: "Research & Development",
        employees: 32,
        budget: "$9.3M",
        performance: "Exceeding",
        location: "Multiple",
        growthRate: "+15%",
        status: "Hiring",
        established: "2017-01-10",
        departments: [
          {
            id: "dept-2101",
            organization: "Clinical Trials",
            employees: 18,
            budget: "$4.2M",
            performance: "Exceeding",
            location: "San Diego",
            growthRate: "+12%",
            status: "Expanding",
            established: "2017-04-18",
          },
          {
            id: "dept-2102",
            organization: "Genomics",
            employees: 14,
            budget: "$5.1M",
            performance: "Exceeding",
            location: "Cambridge",
            growthRate: "+18%",
            status: "Hiring",
            established: "2019-02-21",
          },
        ],
      },
    ],
  },
  // Global Finance
  {
    id: "company-3",
    organization: "Global Finance",
    employees: 121,
    budget: "$15.5M",
    performance: "Meeting",
    location: "New York",
    growthRate: "+3%",
    status: "Restructuring",
    established: "2005-01-01",
    divisions: [
      {
        id: "div-300",
        organization: "Banking Operations",
        employees: 121,
        budget: "$15.5M",
        performance: "Meeting",
        location: "Multiple",
        growthRate: "+3%",
        status: "Stable",
        established: "2005-01-15",
        departments: [
          {
            id: "dept-3001",
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
            id: "dept-3002",
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
            id: "dept-3003",
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
    id: "company-4",
    organization: "Apex University",
    employees: 115,
    budget: "$13.4M",
    performance: "Meeting",
    location: "Cambridge",
    growthRate: "+6%",
    status: "Stable",
    established: "1992-01-01",
    divisions: [
      {
        id: "div-400",
        organization: "Academic Departments",
        employees: 115,
        budget: "$13.4M",
        performance: "Meeting",
        location: "Multiple",
        growthRate: "+6%",
        status: "Stable",
        established: "1992-01-15",
        departments: [
          {
            id: "dept-4001",
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
            id: "dept-4002",
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
            id: "dept-4003",
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
    id: "company-5",
    organization: "Industrial Systems",
    employees: 152,
    budget: "$12.9M",
    performance: "Meeting",
    location: "Detroit",
    growthRate: "+3%",
    status: "Stable",
    established: "2001-01-01",
    divisions: [
      {
        id: "div-500",
        organization: "Production",
        employees: 152,
        budget: "$12.9M",
        performance: "Meeting",
        location: "Multiple",
        growthRate: "+3%",
        status: "Stable",
        established: "2001-01-10",
        departments: [
          {
            id: "dept-5001",
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
            id: "dept-5002",
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
            id: "dept-5003",
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
];

const RowGroupingDemo = (props: UniversalTableProps) => {
  const tableRef = useRef<TableRefType>(null);

  const handleExpandAll = () => {
    tableRef.current?.expandAll();
  };

  const handleCollapseAll = () => {
    tableRef.current?.collapseAll();
  };

  const handleExpandDivisions = () => {
    tableRef.current?.collapseAll();
    tableRef.current?.expandDepth(0);
  };

  const handleExpandAll2Levels = () => {
    tableRef.current?.setExpandedDepths(new Set([0, 1]));
  };

  const handleToggleDivisions = () => {
    tableRef.current?.toggleDepth(0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div
        style={{
          padding: "12px",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: "600", marginRight: "8px" }}>
          Control Expansion:
        </span>
        <button
          onClick={handleExpandAll}
          style={{
            padding: "6px 12px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500",
          }}
          title="tableRef.current?.expandAll()"
        >
          Expand All
        </button>
        <button
          onClick={handleCollapseAll}
          style={{
            padding: "6px 12px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500",
          }}
          title="tableRef.current?.collapseAll()"
        >
          Collapse All
        </button>
        <button
          onClick={handleExpandDivisions}
          style={{
            padding: "6px 12px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500",
          }}
          title="tableRef.current?.expandDepth(0)"
        >
          Only Divisions
        </button>
        <button
          onClick={handleExpandAll2Levels}
          style={{
            padding: "6px 12px",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500",
          }}
          title="tableRef.current?.setExpandedDepths(new Set([0, 1]))"
        >
          Divisions + Departments
        </button>
        <button
          onClick={handleToggleDivisions}
          style={{
            padding: "6px 12px",
            background: "#6f42c1",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500",
          }}
          title="tableRef.current?.toggleDepth(0)"
        >
          Toggle Divisions
        </button>
      </div>
      <SimpleTable
        {...props}
        defaultHeaders={headers}
        enableStickyParents
        getRowId={({ row }: { row: any }) => row.id as string}
        rowGrouping={["divisions", "departments"]}
        rows={rows}
        tableRef={tableRef}
      />
    </div>
  );
};

export const basicRowGroupingDefaults = {
  expandAll: true,
  height: "400px",
};

export default RowGroupingDemo;
