import { useState, useCallback, useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, OnRowGroupExpandProps, Row, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

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
  headcount: number;
  location: string;
}

// Simulated API calls
const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchDivisionsForCompany = async (companyId: string): Promise<Division[]> => {
  await simulateDelay(800);

  const divisionCount = Math.floor(Math.random() * 3) + 2; // 2-4 divisions
  const divisions: Division[] = [];

  const divisionNames = [
    "Cloud Services",
    "AI Research",
    "Consumer Products",
    "Investment Banking",
    "Operations",
    "Engineering",
  ];

  const locations = [
    "San Francisco, CA",
    "New York, NY",
    "Boston, MA",
    "Seattle, WA",
    "Austin, TX",
    "Chicago, IL",
  ];

  for (let i = 0; i < divisionCount; i++) {
    divisions.push({
      id: `${companyId}-div-${i}`,
      divisionName: divisionNames[i % divisionNames.length],
      revenue: `$${Math.floor(Math.random() * 50) + 10}M`,
      profitMargin: `${Math.floor(Math.random() * 30) + 10}%`,
      headcount: Math.floor(Math.random() * 400) + 50,
      location: locations[i % locations.length],
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
  {
    id: "comp-4",
    companyName: "RetailMax Corporation",
    industry: "Retail",
    revenue: "$420M",
    employees: 2100,
  },
  {
    id: "comp-5",
    companyName: "EnergyFlow Systems",
    industry: "Energy",
    revenue: "$560M",
    employees: 1800,
  },
  {
    id: "comp-6",
    companyName: "MediaVision Studios",
    industry: "Entertainment",
    revenue: "$290M",
    employees: 950,
  },
  {
    id: "comp-7",
    companyName: "AutoDrive Industries",
    industry: "Automotive",
    revenue: "$680M",
    employees: 3200,
  },
  {
    id: "comp-8",
    companyName: "CloudNet Services",
    industry: "Technology",
    revenue: "$195M",
    employees: 720,
  },
  {
    id: "comp-9",
    companyName: "HealthCare Solutions",
    industry: "Healthcare",
    revenue: "$380M",
    employees: 1300,
  },
  {
    id: "comp-10",
    companyName: "EducationTech Innovations",
    industry: "Education",
    revenue: "$240M",
    employees: 1050,
  },
  {
    id: "comp-11",
    companyName: "EnergyFlow Systems",
    industry: "Energy",
    revenue: "$560M",
    employees: 1800,
  },

  {
    id: "comp-12",
    companyName: "EnergyFlow Systems",
    industry: "Energy",
    revenue: "$560M",
    employees: 1800,
  },
  {
    id: "comp-13",
    companyName: "EnergyFlow Systems",
    industry: "Energy",
    revenue: "$560M",
    employees: 1800,
  },
  {
    id: "comp-14",
    companyName: "EnergyFlow Systems",
    industry: "Energy",
    revenue: "$560M",
    employees: 1800,
  },
  {
    id: "comp-15",
    companyName: "EnergyFlow Systems",
    industry: "Energy",
    revenue: "$560M",
    employees: 1800,
  },
];

const DynamicNestedTablesDemo = ({
  height = "500px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [rows, setRows] = useState<Company[]>(INITIAL_COMPANIES);

  // Handler for company-level expansions (loading divisions)
  const handleCompanyExpand = useCallback(
    async ({
      row,
      groupingKey,
      isExpanded,
      rowIndexPath,
      rowIdPath,
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
            setEmpty(true, "No divisions found for this company");
            return;
          }

          // Update nested data using rowIndexPath (v2.2.9+: now only numeric indices)
          // rowIndexPath = [0] means rows[0]
          // rowIdPath = ['COMP-1'] (stable ID-based path when getRowId is set)
          setRows((prevRows) => {
            const newRows = [...prevRows];
            const companyIndex = rowIndexPath[0];
            newRows[companyIndex] = {
              ...newRows[companyIndex],
              divisions,
            };
            return newRows;
          });
        }
      } catch (error) {
        console.error("Error fetching divisions:", error);
        setLoading(false);
        setError(error instanceof Error ? error.message : "Failed to load divisions");
      }
    },
    [],
  );

  // Division headers for nested table
  const divisionHeaders: ReactHeaderObject[] = useMemo(
    () => [
      { accessor: "divisionName", label: "Division", width: 200 },
      { accessor: "revenue", label: "Revenue", width: 120 },
      { accessor: "profitMargin", label: "Profit Margin", width: 130 },
      { accessor: "headcount", label: "Headcount", width: 110, type: "number" },
      { accessor: "location", label: "Location", width: 180 },
    ],
    [],
  );

  // Company headers with nested table configuration
  const companyHeaders: ReactHeaderObject[] = useMemo(
    () => [
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
          expandAll: false,
          autoExpandColumns: true,
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
      autoExpandColumns
      defaultHeaders={companyHeaders}
      expandAll={false}
      height={height}
      rowGrouping={["divisions"]}
      getRowId={({ row }) => row.id as string}
      rows={rows}
      onRowGroupExpand={handleCompanyExpand}
      theme={theme}
      loadingStateRenderer={
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          <div>Loading...</div>
        </div>
      }
      errorStateRenderer={
        <div style={{ padding: "20px", textAlign: "center", color: "#dc2626" }}>
          <div>Error loading data</div>
        </div>
      }
      emptyStateRenderer={
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          <div>No data available</div>
        </div>
      }
    />
  );
};

export default DynamicNestedTablesDemo;
