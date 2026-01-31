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

const DynamicNestedTableExample = (props: UniversalTableProps) => {
  const [rows, setRows] = useState<Company[]>(INITIAL_COMPANIES);

  // Division headers for nested table (3 columns)
  const divisionHeaders: HeaderObject[] = useMemo(
    () => [
      { accessor: "divisionName", label: "Division", width: 200 },
      { accessor: "revenue", label: "Revenue", width: 120 },
      { accessor: "profitMargin", label: "Profit Margin", width: 120 },
    ],
    [],
  );

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

          if (divisions.length === 0) {
            setLoading(false);
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

          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Error fetching divisions:", error);
        setLoading(false);
        setError(error instanceof Error ? error.message : "Failed to load divisions");
      }
    },
    [],
  );

  // Company headers with nested table configuration
  const companyHeaders: HeaderObject[] = useMemo(
    () => [
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        expandable: true,
        pinned: "left",
        // Configure nested table for divisions
        nestedTable: {
          defaultHeaders: divisionHeaders,
          expandAll: false,
          autoExpandColumns: true,
          useOddEvenRowBackground: true,
        },
      },
      { accessor: "industry", label: "Industry", width: 150 },
      { accessor: "revenue", label: "Revenue", width: 120 },
      { accessor: "employees", label: "Employees", width: 120, type: "number" },
    ],
    [divisionHeaders],
  );

  return (
    <SimpleTable
      {...props}
      autoExpandColumns
      defaultHeaders={companyHeaders}
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
  );
};

export default DynamicNestedTableExample;
