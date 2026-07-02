// Self-contained demo table setup for this example.
import type { VueHeaderObject } from "@simple-table/vue";


const industries = ["Technology", "Financial Services", "Healthcare", "Manufacturing", "Retail", "Energy", "Telecommunications", "Pharmaceuticals", "Automotive", "Aerospace", "Biotechnology", "E-commerce"];
const cities = ["San Francisco, CA", "New York, NY", "Boston, MA", "Seattle, WA", "Austin, TX", "Chicago, IL", "Los Angeles, CA", "Denver, CO", "Miami, FL", "Atlanta, GA", "Portland, OR", "Dallas, TX"];
const firstNames = ["Jane", "John", "Emily", "Michael", "Sarah", "David", "Lisa", "Robert", "Maria", "James", "Jennifer", "William", "Patricia", "Richard", "Linda"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Anderson", "Taylor", "Thomas", "Moore"];
const divisionTypes = ["Cloud Services", "AI Research", "Consumer Products", "Investment Banking", "Retail Banking", "Research & Development", "Operations", "Sales & Marketing", "Customer Success", "Engineering", "Product Development", "Analytics", "Infrastructure", "Security", "Data Science"];
const companyNames = ["TechCorp", "FinanceHub", "HealthTech", "GlobalSystems", "InnovateLabs", "FutureTech", "DataWorks", "CloudFirst", "SmartSolutions", "NextGen", "PrimeVentures", "AlphaGroup", "BetaSystems", "GammaIndustries", "DeltaCorp"];
const suffixes = ["Global", "Inc", "Solutions", "Systems", "Ventures", "Group", "Industries", "Technologies"];

const randomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const generateDivision = (divisionIndex: number, companyIndex: number) => ({
  divisionId: `DIV-${String(companyIndex * 10 + divisionIndex).padStart(3, "0")}`,
  divisionName: randomElement(divisionTypes),
  revenue: `$${randomInt(5, 25)}B`,
  profitMargin: `${randomInt(15, 50)}%`,
  headcount: randomInt(50, 500),
  location: randomElement(cities),
});

const generateCompany = (companyIndex: number) => {
  const divisions = Array.from({ length: randomInt(3, 7) }, (_, i) => generateDivision(i, companyIndex));
  return {
    id: companyIndex + 1,
    companyName: `${randomElement(companyNames)} ${randomElement(suffixes)}`,
    industry: randomElement(industries),
    founded: randomInt(1985, 2020),
    headquarters: randomElement(cities),
    stockSymbol: Array.from({ length: 4 }, () => String.fromCharCode(65 + randomInt(0, 25))).join(""),
    marketCap: `$${randomInt(10, 200)}B`,
    ceo: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
    revenue: `$${randomInt(5, 60)}B`,
    employees: randomInt(5000, 100000),
    divisions,
  };
};

export const generateNestedTablesData = (count: number = 25) => Array.from({ length: count }, (_, i) => generateCompany(i));

export const nestedTablesDivisionHeaders: VueHeaderObject[] = [
  { accessor: "divisionId", label: "Division ID", width: 120 },
  { accessor: "revenue", label: "Revenue", width: 120 },
  { accessor: "profitMargin", label: "Profit Margin", width: 130 },
  { accessor: "headcount", label: "Headcount", width: 110, type: "number" },
  { accessor: "location", label: "Location", width: "1fr" },
];

export const nestedTablesHeaders: VueHeaderObject[] = [
  {
    accessor: "companyName",
    label: "Company",
    width: 200,
    expandable: true,
    nestedTable: { defaultHeaders: nestedTablesDivisionHeaders },
  },
  { accessor: "stockSymbol", label: "Symbol", width: 100 },
  { accessor: "marketCap", label: "Market Cap", width: 120 },
  { accessor: "revenue", label: "Revenue", width: 120 },
  { accessor: "employees", label: "Employees", width: 120, type: "number" },
];

export const nestedTablesConfig = {
  headers: nestedTablesHeaders,
  tableProps: {
    rowGrouping: ["divisions"] as string[],
    getRowId: ({ row }: { row: Record<string, unknown> }) => row.id as string,
    expandAll: false,
    columnResizing: true,
    autoExpandColumns: true,
  },
} as const;
