/**
 * Dynamic nested tables (lazy-loaded child grids) — vanilla Storybook counterpart to
 * apps/marketing DynamicNestedTablesDemo and packages/examples/vanilla dynamic-nested-tables.
 */
import type { HeaderObject, OnRowGroupExpandProps, Row } from "../../src/index";
import { SimpleTableVanilla } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

type TableInstance = InstanceType<typeof SimpleTableVanilla>;

interface DynamicCompany extends Row {
  id: string;
  companyName: string;
  industry: string;
  revenue: string;
  employees: number;
  divisions?: DynamicDivision[];
}

interface DynamicDivision extends Row {
  id: string;
  divisionName: string;
  revenue: string;
  profitMargin: string;
  headcount: number;
  location: string;
}

const simulateDelay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function fetchDivisionsForCompany(companyId: string): Promise<DynamicDivision[]> {
  await simulateDelay(800);
  const divisionCount = Math.floor(Math.random() * 3) + 2;
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

  return Array.from({ length: divisionCount }, (_, i) => ({
    id: `${companyId}-div-${i}`,
    divisionName: divisionNames[i % divisionNames.length],
    revenue: `$${Math.floor(Math.random() * 50) + 10}M`,
    profitMargin: `${Math.floor(Math.random() * 30) + 10}%`,
    headcount: Math.floor(Math.random() * 400) + 50,
    location: locations[i % locations.length],
  }));
}

/** Initial companies without `divisions`; matches marketing / vanilla examples package. */
const INITIAL_COMPANIES: DynamicCompany[] = [
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

const DIVISION_HEADERS: HeaderObject[] = [
  { accessor: "divisionName", label: "Division", width: 200 },
  { accessor: "revenue", label: "Revenue", width: 120 },
  { accessor: "profitMargin", label: "Profit Margin", width: 130 },
  { accessor: "headcount", label: "Headcount", width: 110, type: "number" },
  { accessor: "location", label: "Location", width: 180 },
];

const COMPANY_HEADERS: HeaderObject[] = [
  {
    accessor: "companyName",
    label: "Company",
    width: 200,
    expandable: true,
    nestedTable: {
      defaultHeaders: DIVISION_HEADERS,
      expandAll: false,
      autoExpandColumns: true,
    },
  },
  { accessor: "industry", label: "Industry", width: 150 },
  { accessor: "revenue", label: "Revenue", width: 120 },
  { accessor: "employees", label: "Employees", width: 120, type: "number" },
];

function stateBlock(message: string, color: string): HTMLElement {
  const el = document.createElement("div");
  el.style.padding = "20px";
  el.style.textAlign = "center";
  el.style.color = color;
  el.textContent = message;
  return el;
}

export const dynamicNestedTableExampleDefaults = {
  height: "460px",
  expandAll: false,
  autoExpandColumns: true,
};

export function renderDynamicNestedTableExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...dynamicNestedTableExampleDefaults, ...args };

  let rows: DynamicCompany[] = INITIAL_COMPANIES.map((r) => ({ ...r }));
  const tableRef: { current?: InstanceType<typeof SimpleTableVanilla> } = {};

  const handleCompanyExpand = async ({
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
        const company = row as DynamicCompany;
        if (company.divisions && company.divisions.length > 0) return;

        setLoading(true);
        const divisions = await fetchDivisionsForCompany(company.id);

        if (divisions.length === 0) {
          setEmpty(true, "No divisions found for this company");
          return;
        }

        const idx = rowIndexPath[0];
        rows = [...rows];
        rows[idx] = { ...rows[idx], divisions };
        tableRef.current?.updateConfig({ rows });
      }
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : "Failed to load divisions");
    }
  };

  const { wrapper, h2, table } = renderVanillaTable(COMPANY_HEADERS, rows, {
    ...options,
    rowGrouping: ["divisions"],
    getRowId: ({ row }) => (row as DynamicCompany).id,
    onRowGroupExpand: handleCompanyExpand,
    loadingStateRenderer: stateBlock("Loading...", "#666"),
    errorStateRenderer: stateBlock("Error loading data", "#dc2626"),
    emptyStateRenderer: stateBlock("No data available", "#666"),
    theme: "dark",
  });

  tableRef.current = table;
  h2.textContent = "Dynamic Nested Table (lazy-loaded divisions)";
  return wrapper;
}
