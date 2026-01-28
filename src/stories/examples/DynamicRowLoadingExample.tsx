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
}

interface Team extends Row {
  id: string;
  name: string;
  type: "team";
  employeeCount?: number;
  budget?: string;
  lead?: string;
  employees?: Employee[];
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

// Data generation utilities
const FIRST_NAMES = [
  "Alice",
  "Bob",
  "Carol",
  "David",
  "Emma",
  "Frank",
  "Grace",
  "Henry",
  "Iris",
  "Jack",
  "Karen",
  "Liam",
  "Mia",
  "Noah",
  "Olivia",
  "Peter",
  "Quinn",
  "Rachel",
  "Sam",
  "Taylor",
  "Uma",
  "Victor",
  "Wendy",
  "Xavier",
  "Yara",
  "Zane",
  "Amy",
  "Ben",
  "Chloe",
  "Dan",
];

const LAST_NAMES = [
  "Johnson",
  "Smith",
  "White",
  "Brown",
  "Davis",
  "Miller",
  "Lee",
  "Wilson",
  "Taylor",
  "Anderson",
  "Thomas",
  "Martinez",
  "Garcia",
  "Rodriguez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Perez",
  "Moore",
  "Jackson",
  "Martin",
  "Thompson",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Green",
  "Baker",
  "Adams",
];

const DEPARTMENT_NAMES = [
  "Engineering",
  "Operations",
  "Product",
  "Marketing",
  "Sales",
  "Finance",
  "Human Resources",
  "Customer Success",
  "Legal",
  "Research & Development",
  "Quality Assurance",
  "Data Science",
];

const TEAM_NAMES = [
  "Frontend Team",
  "Backend Team",
  "Mobile Team",
  "Cloud Infrastructure",
  "Security Team",
  "Product Management",
  "UX Research",
  "DevOps Team",
  "Analytics Team",
  "Platform Team",
  "API Team",
  "Data Engineering",
  "Machine Learning",
  "Design System",
  "Testing Team",
];

const ROLES = [
  "Senior Frontend Developer",
  "Frontend Developer",
  "UI Designer",
  "Senior Backend Developer",
  "Backend Developer",
  "iOS Developer",
  "Android Developer",
  "DevOps Engineer",
  "Cloud Architect",
  "Security Engineer",
  "Product Manager",
  "Associate Product Manager",
  "UX Researcher",
  "Senior Software Engineer",
  "Software Engineer",
  "Tech Lead",
  "Engineering Manager",
];

const generateRandomDate = (startYear: number, endYear: number): string => {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split("T")[0];
};

const generateRandomSalary = (min: number, max: number): string => {
  const salary = Math.floor(Math.random() * (max - min) + min);
  return `$${salary.toLocaleString()}`;
};

const generateRandomBudget = (min: number, max: number): string => {
  const budget = Math.floor(Math.random() * (max - min) + min);
  return `$${budget.toLocaleString()}`;
};

const getRandomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate departments
const generateDepartments = (count: number): Department[] => {
  return Array.from({ length: count }, (_, index) => {
    const employeeCount = Math.floor(Math.random() * 30) + 5; // 5-35 employees
    return {
      id: `DEPT-${index + 1}`,
      name: DEPARTMENT_NAMES[index % DEPARTMENT_NAMES.length],
      type: "department",
      employeeCount,
      budget: generateRandomBudget(500000, 3000000),
      manager: `${getRandomItem(FIRST_NAMES)} ${getRandomItem(LAST_NAMES)}`,
    };
  });
};

// Generate teams for a department
const generateTeamsForDepartment = (departmentId: string, count: number): Team[] => {
  const startIndex = parseInt(departmentId.split("-")[1]) * 10;
  return Array.from({ length: count }, (_, index) => {
    const employeeCount = Math.floor(Math.random() * 12); // 0-11 employees (some teams can be empty)
    return {
      id: `TEAM-${startIndex + index + 1}`,
      name: TEAM_NAMES[(startIndex + index) % TEAM_NAMES.length],
      type: "team",
      employeeCount,
      budget: generateRandomBudget(200000, 1000000),
      lead: `${getRandomItem(FIRST_NAMES)} ${getRandomItem(LAST_NAMES)}`,
    };
  });
};

// Generate employees for a team
const generateEmployeesForTeam = (teamId: string, count: number): Employee[] => {
  const startIndex = parseInt(teamId.split("-")[1]) * 100;
  return Array.from({ length: count }, (_, index) => {
    const firstName = getRandomItem(FIRST_NAMES);
    const lastName = getRandomItem(LAST_NAMES);
    return {
      id: `EMP-${startIndex + index + 1}`,
      name: `${firstName} ${lastName}`,
      type: "employee",
      role: getRandomItem(ROLES),
      salary: generateRandomSalary(70000, 150000),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      startDate: generateRandomDate(2018, 2024),
    };
  });
};

// Simulated API: Fetch teams for a department
const fetchTeamsForDepartment = async (departmentId: string): Promise<Team[]> => {
  await delay(1200); // Simulate network delay

  // Generate 2-5 teams per department
  const teamCount = Math.floor(Math.random() * 4) + 2;
  return generateTeamsForDepartment(departmentId, teamCount);
};

// Simulated API: Fetch employees for a team
const fetchEmployeesForTeam = async (teamId: string): Promise<Employee[]> => {
  await delay(800); // Simulate network delay

  // Generate 1-8 employees per team
  const employeeCount = Math.floor(Math.random() * 8) + 1;
  return generateEmployeesForTeam(teamId, employeeCount);
};

export const dynamicRowLoadingDefaults = {
  height: "calc(100dvh - 112px)",
  columnResizing: true,
  selectableCells: true,
};

const DynamicRowLoadingExample = (props: UniversalTableProps) => {
  // Initialize with departments only (no teams loaded yet)
  // You can change the number of departments here (default: 5)
  const [rows, setRows] = useState<Department[]>(() => generateDepartments(40));

  const handleRowExpand = useCallback(
    async ({
      row,
      depth,
      groupingKey,
      isExpanded,
      setLoading,
      setError,
      setEmpty,
      rowIndexPath,
    }: OnRowGroupExpandProps) => {
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
          // Set loading state using the helper
          setLoading(true);

          // Use row.id to fetch data (not rowId which was the internal path)
          const department = row as Department;
          const teams = await fetchTeamsForDepartment(department.id);

          // Show empty state if no teams
          if (teams.length === 0) {
            setLoading(false);
            setEmpty(true, "No teams found for this department");
            return;
          }

          // Update nested data using rowIndexPath
          // rowIndexPath = [0] means rows[0]
          setRows((prevRows) => {
            const newRows = [...prevRows];
            newRows[rowIndexPath[0] as number].teams = teams;
            return newRows;
          });

          setLoading(false);
        } else if (depth === 1 && groupingKey === "employees") {
          // Set loading state
          setLoading(true);

          // Use row.id to fetch data (not rowId which was the internal path)
          const team = row as Team;
          const employees = await fetchEmployeesForTeam(team.id);

          // Show empty state if no employees
          if (employees.length === 0) {
            setLoading(false);
            setEmpty(true, "No employees found for this team");
            return;
          }

          // Update nested data using rowIndexPath
          // rowIndexPath = [0, 'teams', 1] means rows[0].teams[1]
          setRows((prevRows) => {
            const newRows = [...prevRows];
            const deptIndex = rowIndexPath[0] as number;
            const teamIndex = rowIndexPath[2] as number;
            const department = newRows[deptIndex];

            if (department.teams && department.teams[teamIndex]) {
              department.teams[teamIndex].employees = employees;
            }

            return newRows;
          });

          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setLoading(false);
        setError(error instanceof Error ? error.message : "Failed to load data");
      }
    },
    [],
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
              The expand icon only shows when <strong>employeeCount &gt; 0</strong> (using{" "}
              <code>canExpandRowGroup</code> prop)
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
        autoExpandColumns
        canExpandRowGroup={(row) => {
          // Only show expand icon if row has employeeCount > 0
          const typedRow = row as Department | Team | Employee;
          const employeeCount = typedRow.employeeCount;
          return typeof employeeCount === "number" && employeeCount > 0;
        }}
        columnResizing
        defaultHeaders={HEADERS}
        editColumns
        expandAll={false}
        height={props.height ?? "calc(100dvh - 200px)"}
        onRowGroupExpand={handleRowExpand}
        rowGrouping={["teams", "employees"]}
        rows={rows}
        selectableCells
        theme={props.theme}
        useOddEvenRowBackground
        // loadingStateRenderer={<div>Loading...</div>}
        errorStateRenderer={<div>Error loading data</div>}
        emptyStateRenderer={<div>No data found</div>}
        customTheme={{
          rowHeight: 100,
        }}
      />
    </div>
  );
};

export default DynamicRowLoadingExample;
