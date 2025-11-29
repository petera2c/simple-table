import { useState, useCallback } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import { UniversalTableProps } from "./StoryWrapper";
import OnRowGroupExpandProps from "../../types/OnRowGroupExpandProps";
import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";

// Type definitions
interface Department extends Row {
  id: string;
  name: string;
  type: "department";
  employeeCount?: number;
  budget?: string;
  manager?: string;
  teams?: Team[];
  _loading?: boolean;
  _error?: string | null;
}

interface Team extends Row {
  id: string;
  name: string;
  type: "team";
  employeeCount?: number;
  budget?: string;
  lead?: string;
  employees?: Employee[];
  _loading?: boolean;
  _error?: string | null;
}

interface Employee extends Row {
  id: string;
  name: string;
  type: "employee";
  role: string;
  salary: string;
  email: string;
  startDate: string;
}

// Headers configuration
const HEADERS: HeaderObject[] = [
  {
    accessor: "name",
    label: "Name",
    width: 250,
    expandable: true,
    type: "string",
    pinned: "left",
  },
  {
    accessor: "type",
    label: "Type",
    width: 120,
    type: "string",
  },
  {
    accessor: "employeeCount",
    label: "Employees",
    width: 120,
    type: "number",
    align: "right",
  },
  {
    accessor: "budget",
    label: "Budget",
    width: 140,
    type: "string",
    align: "right",
  },
  {
    accessor: "manager",
    label: "Manager/Lead",
    width: 180,
    type: "string",
    valueGetter: ({ row }) => {
      if (row.type === "department") return row.manager as string;
      if (row.type === "team") return row.lead as string;
      return row.role as string;
    },
  },
  {
    accessor: "email",
    label: "Email",
    width: 220,
    type: "string",
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    type: "string",
    align: "right",
  },
  {
    accessor: "startDate",
    label: "Start Date",
    width: 120,
    type: "date",
  },
];

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulated API: Fetch teams for a department
const fetchTeamsForDepartment = async (departmentId: string): Promise<Team[]> => {
  await delay(1200); // Simulate network delay

  // Simulated data based on department
  const teamsData: Record<string, Team[]> = {
    "DEPT-1": [
      {
        id: "TEAM-1",
        name: "Frontend Team",
        type: "team",
        employeeCount: 8,
        budget: "$720,000",
        lead: "Sarah Connor",
      },
      {
        id: "TEAM-2",
        name: "Backend Team",
        type: "team",
        employeeCount: 10,
        budget: "$950,000",
        lead: "John Reese",
      },
      {
        id: "TEAM-3",
        name: "Mobile Team",
        type: "team",
        employeeCount: 6,
        budget: "$540,000",
        lead: "Jessica Day",
      },
    ],
    "DEPT-2": [
      {
        id: "TEAM-4",
        name: "Cloud Infrastructure",
        type: "team",
        employeeCount: 7,
        budget: "$840,000",
        lead: "Marcus Kane",
      },
      {
        id: "TEAM-5",
        name: "Security Team",
        type: "team",
        employeeCount: 5,
        budget: "$650,000",
        lead: "Octavia Blake",
      },
    ],
    "DEPT-3": [
      {
        id: "TEAM-6",
        name: "Product Management",
        type: "team",
        employeeCount: 4,
        budget: "$480,000",
        lead: "Clarke Griffin",
      },
      {
        id: "TEAM-7",
        name: "UX Research",
        type: "team",
        employeeCount: 3,
        budget: "$360,000",
        lead: "Raven Reyes",
      },
    ],
  };

  return teamsData[departmentId] || [];
};

// Simulated API: Fetch employees for a team
const fetchEmployeesForTeam = async (teamId: string): Promise<Employee[]> => {
  await delay(800); // Simulate network delay

  // Simulated data based on team
  const employeesData: Record<string, Employee[]> = {
    "TEAM-1": [
      {
        id: "EMP-1",
        name: "Alice Johnson",
        type: "employee",
        role: "Senior Frontend Developer",
        salary: "$105,000",
        email: "alice.johnson@company.com",
        startDate: "2021-03-15",
      },
      {
        id: "EMP-2",
        name: "Bob Smith",
        type: "employee",
        role: "Frontend Developer",
        salary: "$85,000",
        email: "bob.smith@company.com",
        startDate: "2022-06-01",
      },
      {
        id: "EMP-3",
        name: "Carol White",
        type: "employee",
        role: "UI Designer",
        salary: "$78,000",
        email: "carol.white@company.com",
        startDate: "2022-09-12",
      },
    ],
    "TEAM-2": [
      {
        id: "EMP-4",
        name: "David Brown",
        type: "employee",
        role: "Senior Backend Developer",
        salary: "$115,000",
        email: "david.brown@company.com",
        startDate: "2020-01-20",
      },
      {
        id: "EMP-5",
        name: "Emma Davis",
        type: "employee",
        role: "Backend Developer",
        salary: "$90,000",
        email: "emma.davis@company.com",
        startDate: "2021-11-05",
      },
    ],
    "TEAM-3": [
      {
        id: "EMP-6",
        name: "Frank Miller",
        type: "employee",
        role: "iOS Developer",
        salary: "$95,000",
        email: "frank.miller@company.com",
        startDate: "2021-07-18",
      },
      {
        id: "EMP-7",
        name: "Grace Lee",
        type: "employee",
        role: "Android Developer",
        salary: "$92,000",
        email: "grace.lee@company.com",
        startDate: "2022-02-28",
      },
    ],
    "TEAM-4": [
      {
        id: "EMP-8",
        name: "Henry Wilson",
        type: "employee",
        role: "DevOps Engineer",
        salary: "$110,000",
        email: "henry.wilson@company.com",
        startDate: "2020-08-10",
      },
      {
        id: "EMP-9",
        name: "Iris Taylor",
        type: "employee",
        role: "Cloud Architect",
        salary: "$125,000",
        email: "iris.taylor@company.com",
        startDate: "2019-05-22",
      },
    ],
    "TEAM-5": [
      {
        id: "EMP-10",
        name: "Jack Anderson",
        type: "employee",
        role: "Security Engineer",
        salary: "$108,000",
        email: "jack.anderson@company.com",
        startDate: "2021-04-14",
      },
    ],
    "TEAM-6": [
      {
        id: "EMP-11",
        name: "Karen Thomas",
        type: "employee",
        role: "Product Manager",
        salary: "$120,000",
        email: "karen.thomas@company.com",
        startDate: "2020-10-05",
      },
      {
        id: "EMP-12",
        name: "Liam Martinez",
        type: "employee",
        role: "Associate Product Manager",
        salary: "$88,000",
        email: "liam.martinez@company.com",
        startDate: "2023-01-10",
      },
    ],
    "TEAM-7": [
      {
        id: "EMP-13",
        name: "Mia Garcia",
        type: "employee",
        role: "UX Researcher",
        salary: "$95,000",
        email: "mia.garcia@company.com",
        startDate: "2021-12-01",
      },
    ],
  };

  return employeesData[teamId] || [];
};

// Helper to update row children (nested data)
const updateRowChildren = (
  rows: Department[],
  rowId: string,
  groupingKey: string,
  children: any[]
): Department[] => {
  return rows.map((row) => {
    // Check if this is the row we're looking for
    if (row.id === rowId) {
      return { ...row, [groupingKey]: children, _loading: false };
    }

    // Recursively check nested rows if they exist
    if (row.teams && Array.isArray(row.teams)) {
      return {
        ...row,
        teams: row.teams.map((team) => {
          if (team.id === rowId) {
            return { ...team, [groupingKey]: children, _loading: false };
          }
          return team;
        }),
      };
    }

    return row;
  });
};

// Helper to set loading state
const setRowLoading = (rows: Department[], rowId: string, isLoading: boolean): Department[] => {
  return rows.map((row) => {
    if (row.id === rowId) {
      return { ...row, _loading: isLoading };
    }

    if (row.teams && Array.isArray(row.teams)) {
      return {
        ...row,
        teams: row.teams.map((team) => {
          if (team.id === rowId) {
            return { ...team, _loading: isLoading };
          }
          return team;
        }),
      };
    }

    return row;
  });
};

export const dynamicRowLoadingDefaults = {
  height: "calc(100dvh - 112px)",
  columnResizing: true,
  selectableCells: true,
};

const DynamicRowLoadingExample = (props: UniversalTableProps) => {
  // Initialize with departments only (no teams loaded yet)
  const [rows, setRows] = useState<Department[]>([
    {
      id: "DEPT-1",
      name: "Engineering",
      type: "department",
      employeeCount: 24,
      budget: "$2,210,000",
      manager: "Michael Scott",
    },
    {
      id: "DEPT-2",
      name: "Operations",
      type: "department",
      employeeCount: 12,
      budget: "$1,490,000",
      manager: "Dwight Schrute",
    },
    {
      id: "DEPT-3",
      name: "Product",
      type: "department",
      employeeCount: 7,
      budget: "$840,000",
      manager: "Pam Beesly",
    },
  ]);

  const handleRowExpand = useCallback(
    async ({ row, rowId, depth, groupingKey, isExpanded }: OnRowGroupExpandProps) => {
      // Don't fetch if collapsing
      if (!isExpanded) {
        return;
      }

      // Don't fetch if data already exists
      if (groupingKey && row[groupingKey] && (row[groupingKey] as any[]).length > 0) {
        return;
      }

      try {
        if (depth === 0 && groupingKey === "teams") {
          // Set loading state
          setRows((prevRows) => setRowLoading(prevRows, String(rowId), true));

          const teams = await fetchTeamsForDepartment(String(rowId));

          // Update with fetched data
          setRows((prevRows) => updateRowChildren(prevRows, String(rowId), "teams", teams));
        } else if (depth === 1 && groupingKey === "employees") {
          // Set loading state
          setRows((prevRows) => setRowLoading(prevRows, String(rowId), true));

          const employees = await fetchEmployeesForTeam(String(rowId));

          // Update with fetched data
          setRows((prevRows) => updateRowChildren(prevRows, String(rowId), "employees", employees));
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setRows((prevRows) => setRowLoading(prevRows, String(rowId), false));
      }
    },
    []
  );

  return (
    <div>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f0fdf4",
          border: "2px solid #22c55e",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: "0 0 12px 0", color: "#15803d", fontSize: "20px" }}>
          🚀 Dynamic Row Loading Demo
        </h2>
        <div style={{ fontSize: "14px", color: "#166534", lineHeight: "1.6" }}>
          <p style={{ margin: "0 0 8px 0" }}>
            <strong>This example demonstrates lazy-loading hierarchical data:</strong>
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>
              <strong>Departments</strong> load immediately (no children)
            </li>
            <li>
              Click to expand a department → <strong>Teams</strong> are fetched from the "API"
            </li>
            <li>
              Click to expand a team → <strong>Employees</strong> are fetched from the "API"
            </li>
            <li>
              Open the <strong>browser console</strong> to see the API simulation in action! 🔍
            </li>
          </ul>
          <p style={{ margin: "12px 0 0 0", fontStyle: "italic" }}>
            💡 Try expanding different departments and teams to see how data loads on demand.
          </p>
        </div>
      </div>

      <SimpleTable
        columnResizing
        defaultHeaders={HEADERS}
        editColumns
        expandAll={false}
        height={props.height ?? "calc(100dvh - 200px)"}
        onRowGroupExpand={handleRowExpand}
        rowGrouping={["teams", "employees"]}
        rowIdAccessor="id"
        rows={rows}
        selectableCells
        theme={props.theme}
        useOddEvenRowBackground
      />
    </div>
  );
};

export default DynamicRowLoadingExample;
