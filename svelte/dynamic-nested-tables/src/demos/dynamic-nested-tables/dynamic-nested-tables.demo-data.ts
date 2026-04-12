// Self-contained demo table setup for this example.
import type { HeaderObject, Row } from "@simple-table/svelte";


export interface DynamicCompany extends Row {
  id: string;
  companyName: string;
  industry: string;
  revenue: string;
  employees: number;
  divisions?: DynamicDivision[];
}

export interface DynamicDivision extends Row {
  id: string;
  divisionName: string;
  revenue: string;
  profitMargin: string;
  headcount: number;
  location: string;
}

const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchDivisionsForCompany = async (companyId: string): Promise<DynamicDivision[]> => {
  await simulateDelay(800);
  const divisionCount = Math.floor(Math.random() * 3) + 2;
  const divisionNames = ["Cloud Services", "AI Research", "Consumer Products", "Investment Banking", "Operations", "Engineering"];
  const locations = ["San Francisco, CA", "New York, NY", "Boston, MA", "Seattle, WA", "Austin, TX", "Chicago, IL"];

  return Array.from({ length: divisionCount }, (_, i) => ({
    id: `${companyId}-div-${i}`,
    divisionName: divisionNames[i % divisionNames.length],
    revenue: `$${Math.floor(Math.random() * 50) + 10}M`,
    profitMargin: `${Math.floor(Math.random() * 30) + 10}%`,
    headcount: Math.floor(Math.random() * 400) + 50,
    location: locations[i % locations.length],
  }));
};

export const dynamicNestedTablesData: DynamicCompany[] = [
  { id: "comp-1", companyName: "TechCorp Global", industry: "Technology", revenue: "$250M", employees: 1200 },
  { id: "comp-2", companyName: "FinanceHub Inc", industry: "Financial Services", revenue: "$180M", employees: 850 },
  { id: "comp-3", companyName: "HealthTech Solutions", industry: "Healthcare", revenue: "$320M", employees: 1500 },
  { id: "comp-4", companyName: "RetailMax Corporation", industry: "Retail", revenue: "$420M", employees: 2100 },
  { id: "comp-5", companyName: "EnergyFlow Systems", industry: "Energy", revenue: "$560M", employees: 1800 },
  { id: "comp-6", companyName: "MediaVision Studios", industry: "Entertainment", revenue: "$290M", employees: 950 },
  { id: "comp-7", companyName: "AutoDrive Industries", industry: "Automotive", revenue: "$680M", employees: 3200 },
  { id: "comp-8", companyName: "CloudNet Services", industry: "Technology", revenue: "$195M", employees: 720 },
  { id: "comp-9", companyName: "HealthCare Solutions", industry: "Healthcare", revenue: "$380M", employees: 1300 },
  { id: "comp-10", companyName: "EducationTech Innovations", industry: "Education", revenue: "$240M", employees: 1050 },
  { id: "comp-11", companyName: "EnergyFlow Systems", industry: "Energy", revenue: "$560M", employees: 1800 },
  { id: "comp-12", companyName: "EnergyFlow Systems", industry: "Energy", revenue: "$560M", employees: 1800 },
  { id: "comp-13", companyName: "EnergyFlow Systems", industry: "Energy", revenue: "$560M", employees: 1800 },
  { id: "comp-14", companyName: "EnergyFlow Systems", industry: "Energy", revenue: "$560M", employees: 1800 },
  { id: "comp-15", companyName: "EnergyFlow Systems", industry: "Energy", revenue: "$560M", employees: 1800 },
];

export const dynamicNestedTablesDivisionHeaders: HeaderObject[] = [
  { accessor: "divisionName", label: "Division", width: 200 },
  { accessor: "revenue", label: "Revenue", width: 120 },
  { accessor: "profitMargin", label: "Profit Margin", width: 130 },
  { accessor: "headcount", label: "Headcount", width: 110, type: "number" },
  { accessor: "location", label: "Location", width: 180 },
];

export const dynamicNestedTablesCompanyHeaders: HeaderObject[] = [
  {
    accessor: "companyName",
    label: "Company",
    width: 200,
    expandable: true,
    nestedTable: {
      defaultHeaders: dynamicNestedTablesDivisionHeaders,
      expandAll: false,
      autoExpandColumns: true,
    },
  },
  { accessor: "industry", label: "Industry", width: 150 },
  { accessor: "revenue", label: "Revenue", width: 120 },
  { accessor: "employees", label: "Employees", width: 120, type: "number" },
];

export const dynamicNestedTablesConfig = {
  headers: dynamicNestedTablesCompanyHeaders,
  rows: dynamicNestedTablesData,
  tableProps: {
    rowGrouping: ["divisions"] as string[],
    getRowId: ({ row }: { row: Record<string, unknown> }) => row.id as string,
    expandAll: false,
    autoExpandColumns: true,
  },
} as const;
