import { useState, useCallback, useMemo } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import { UniversalTableProps } from "./StoryWrapper";
import OnRowGroupExpandProps from "../../types/OnRowGroupExpandProps";
import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";

// Type definitions
interface Company extends Row {
  id: string;
  companyName: string;
  industry: string;
  revenue: string;
  employees: number;
  divisions?: Division[];
}

interface Division extends Row {
  id: string;
  divisionName: string;
  revenue: string;
  profitMargin: string;
  teams?: Team[];
}

interface Team extends Row {
  id: string;
  teamName: string;
  manager: string;
  headcount: number;
  budget: string;
}

// Simulated API calls
const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchDivisionsForCompany = async (companyId: string): Promise<Division[]> => {
  await simulateDelay(800);

  const divisionCount = Math.floor(Math.random() * 3) + 2; // 2-4 divisions
  const divisions: Division[] = [];

  for (let i = 0; i < divisionCount; i++) {
    divisions.push({
      id: `${companyId}-div-${i}`,
      divisionName: `Division ${String.fromCharCode(65 + i)}`,
      revenue: `$${Math.floor(Math.random() * 50) + 10}M`,
      profitMargin: `${Math.floor(Math.random() * 30) + 10}%`,
    });
  }

  return divisions;
};

const fetchTeamsForDivision = async (divisionId: string): Promise<Team[]> => {
  await simulateDelay(600);

  const teamCount = Math.floor(Math.random() * 4) + 2; // 2-5 teams
  const teams: Team[] = [];

  for (let i = 0; i < teamCount; i++) {
    teams.push({
      id: `${divisionId}-team-${i}`,
      teamName: `Team ${i + 1}`,
      manager: `Manager ${String.fromCharCode(65 + i)}`,
      headcount: Math.floor(Math.random() * 20) + 5,
      budget: `$${Math.floor(Math.random() * 5) + 1}M`,
    });
  }

  return teams;
};

// Initial company data (no divisions loaded yet)
const INITIAL_COMPANIES: Company[] = [
  {
    id: "comp-1",
    companyName: "TechCorp Global",
    industry: "Technology",
    revenue: "$250M",
    employees: 1200,
  },
  {
    id: "comp-2",
    companyName: "FinanceHub Inc",
    industry: "Financial Services",
    revenue: "$180M",
    employees: 850,
  },
  {
    id: "comp-3",
    companyName: "HealthTech Solutions",
    industry: "Healthcare",
    revenue: "$320M",
    employees: 1500,
  },
];

// Division headers for nested table (3 columns)
const divisionHeaders: HeaderObject[] = [
  { accessor: "divisionName", label: "Division", width: 200, expandable: true },
  { accessor: "revenue", label: "Revenue", width: 120 },
  { accessor: "profitMargin", label: "Profit Margin", width: 120 },
];

// Team headers for deeply nested table (5 columns)
const teamHeaders: HeaderObject[] = [
  { accessor: "teamName", label: "Team", width: 150 },
  { accessor: "manager", label: "Manager", width: 150 },
  { accessor: "headcount", label: "Headcount", width: 100, type: "number" },
  { accessor: "budget", label: "Budget", width: 100 },
];

const DynamicNestedTableExample = (props: UniversalTableProps) => {
  const [rows, setRows] = useState<Company[]>(INITIAL_COMPANIES);

  // Handler for company-level expansions (loading divisions)
  const handleCompanyExpand = useCallback(
    async ({
      row,
      groupingKey,
      isExpanded,
      rowIndexPath,
      setLoading,
      setError,
      setEmpty,
    }: OnRowGroupExpandProps) => {
      if (!isExpanded) return;

      try {
        if (groupingKey === "divisions") {
          const company = row as Company;

          if (company.divisions && company.divisions.length > 0) {
            return;
          }

          setLoading(true);
          const divisions = await fetchDivisionsForCompany(company.id);
          setLoading(false);

          if (divisions.length === 0) {
            setEmpty(true, "No divisions found for this company");
            return;
          }

          setRows((prevRows) => {
            const newRows = [...prevRows];
            const companyIndex = rowIndexPath[0] as number;
            newRows[companyIndex] = {
              ...newRows[companyIndex],
              divisions,
            };
            return newRows;
          });
        }
      } catch (error) {
        console.error("❌ Error fetching divisions:", error);
        setLoading(false);
        setError(error instanceof Error ? error.message : "Failed to load divisions");
      }
    },
    [],
  );

  // Handler for division-level expansions (loading teams)
  const handleDivisionExpand = useCallback(
    async ({
      row,
      groupingKey,
      isExpanded,
      rowIndexPath,
      setLoading,
      setError,
      setEmpty,
    }: OnRowGroupExpandProps) => {
      if (!isExpanded) return;
      console.log("here");

      try {
        if (groupingKey === "teams") {
          const division = row as Division;

          if (division.teams && division.teams.length > 0) {
            return;
          }

          setLoading(true);
          const teams = await fetchTeamsForDivision(division.id);
          setLoading(false);

          if (teams.length === 0) {
            setEmpty(true, "No teams found for this division");
            return;
          }

          // Need to update the parent company's divisions array
          // We need to track which company this division belongs to
          // This is tricky because the nested table doesn't know about parent context

          // For now, we'll need to find the company by searching
          setRows((prevRows) => {
            const newRows = [...prevRows];

            // Find the company that contains this division
            for (const company of newRows) {
              if (company.divisions) {
                const divisionIndex = company.divisions.findIndex((d) => d.id === division.id);
                if (divisionIndex !== -1) {
                  company.divisions[divisionIndex] = {
                    ...company.divisions[divisionIndex],
                    teams,
                  };
                  break;
                }
              }
            }

            return newRows;
          });
        }
      } catch (error) {
        console.error("❌ Error fetching teams:", error);
        setLoading(false);
        setError(error instanceof Error ? error.message : "Failed to load teams");
      }
    },
    [],
  );

  // Company headers with nested table configuration
  const companyHeaders: HeaderObject[] = [
    {
      accessor: "companyName",
      label: "Company",
      width: 200,
      expandable: true,
      pinned: "left",
      // Configure nested table for divisions
      nestedTable: {
        defaultHeaders: divisionHeaders.map((header) => {
          // Configure nested table for teams at division level
          if (header.accessor === "divisionName") {
            return {
              ...header,
              nestedTable: {
                defaultHeaders: teamHeaders,
                expandAll: false,
                autoExpandColumns: true,
                useOddEvenRowBackground: true,
                onRowGroupExpand: handleDivisionExpand,
              },
            };
          }
          return header;
        }),
        expandAll: false,
        autoExpandColumns: true,
        useOddEvenRowBackground: true,
        onRowGroupExpand: handleDivisionExpand,
      },
    },
    { accessor: "industry", label: "Industry", width: 150 },
    { accessor: "revenue", label: "Revenue", width: 120 },
    { accessor: "employees", label: "Employees", width: 120, type: "number" },
  ];

  return (
    <div>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fef3c7",
          border: "2px solid #f59e0b",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: "0 0 12px 0", color: "#92400e", fontSize: "20px" }}>
          🎯 Dynamic Nested Table Loading Demo
        </h2>
        <div style={{ fontSize: "14px", color: "#78350f", lineHeight: "1.6" }}>
          <p style={{ margin: "0 0 8px 0" }}>
            <strong>
              This example demonstrates lazy-loading nested tables with explicit handlers:
            </strong>
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>
              <strong>Companies</strong> load immediately (no divisions yet)
            </li>
            <li>
              Click to expand a company → <strong>Divisions</strong> are fetched and shown in a{" "}
              <strong>nested table</strong>
            </li>
            <li>
              Click to expand a division → <strong>Teams</strong> are fetched and shown in a{" "}
              <strong>nested nested table</strong>
            </li>
            <li>
              Each nested table has its own <code>onRowGroupExpand</code> handler in the{" "}
              <code>nestedTable</code> config
            </li>
            <li>
              <strong>Handlers are explicit</strong> - each table level has clear, separate logic
            </li>
            <li>No confusion about depth/indices - each handler deals with its own table's data</li>
            <li>
              Open the <strong>browser console</strong> to see the API simulation! 🔍
            </li>
          </ul>
          <p style={{ margin: "12px 0 0 0", fontStyle: "italic" }}>
            💡 Try expanding companies and divisions to see multi-level nested tables loading on
            demand with separate handlers.
          </p>
        </div>
      </div>

      <SimpleTable
        {...props}
        columnResizing
        defaultHeaders={companyHeaders}
        editColumns
        expandAll={false}
        height={props.height ?? "calc(100dvh - 200px)"}
        rowGrouping={["divisions", "teams"]}
        rows={rows}
        selectableCells
        useOddEvenRowBackground
        onRowGroupExpand={handleCompanyExpand}
        loadingStateRenderer={
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            <div>⏳ Loading...</div>
          </div>
        }
        errorStateRenderer={
          <div style={{ padding: "20px", textAlign: "center", color: "#dc2626" }}>
            <div>❌ Error loading data</div>
          </div>
        }
        emptyStateRenderer={
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            <div>📭 No data available</div>
          </div>
        }
      />
    </div>
  );
};

export default DynamicNestedTableExample;
