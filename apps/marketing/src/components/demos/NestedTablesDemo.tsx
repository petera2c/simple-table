"use client";
import { useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

// Data generation utilities
const industries = [
  "Technology",
  "Financial Services",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "Energy",
  "Telecommunications",
  "Pharmaceuticals",
  "Automotive",
  "Aerospace",
  "Biotechnology",
  "E-commerce",
];

const cities = [
  "San Francisco, CA",
  "New York, NY",
  "Boston, MA",
  "Seattle, WA",
  "Austin, TX",
  "Chicago, IL",
  "Los Angeles, CA",
  "Denver, CO",
  "Miami, FL",
  "Atlanta, GA",
  "Portland, OR",
  "Dallas, TX",
];

const firstNames = [
  "Jane",
  "John",
  "Emily",
  "Michael",
  "Sarah",
  "David",
  "Lisa",
  "Robert",
  "Maria",
  "James",
  "Jennifer",
  "William",
  "Patricia",
  "Richard",
  "Linda",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Anderson",
  "Taylor",
  "Thomas",
  "Moore",
];

const divisionTypes = [
  "Cloud Services",
  "AI Research",
  "Consumer Products",
  "Investment Banking",
  "Retail Banking",
  "Research & Development",
  "Operations",
  "Sales & Marketing",
  "Customer Success",
  "Engineering",
  "Product Development",
  "Analytics",
  "Infrastructure",
  "Security",
  "Data Science",
];

const teamTypes = [
  "Infrastructure",
  "Security",
  "Machine Learning",
  "M&A Advisory",
  "Frontend Development",
  "Backend Services",
  "DevOps",
  "Quality Assurance",
  "Product Management",
  "Data Engineering",
  "Mobile Development",
  "Platform",
  "API Services",
  "Business Intelligence",
  "Customer Analytics",
];

const skills = [
  "Kubernetes",
  "Deep Learning",
  "Financial Modeling",
  "React",
  "Python",
  "Cloud Architecture",
  "Data Analytics",
  "Cybersecurity",
  "Blockchain",
  "Machine Learning",
  "DevOps",
  "Product Strategy",
  "AWS",
  "TypeScript",
];

const awards = [
  "Best Team 2023",
  "Innovation Award",
  "Security Excellence",
  "Deal of the Year",
  "Outstanding Performance",
  "Excellence in Innovation",
  "Top Performer",
  "Best in Class",
  "Industry Leader",
  "Customer Choice",
  null,
  null,
];

const randomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number, decimals: number = 1): number =>
  Number((Math.random() * (max - min) + min).toFixed(decimals));

// Generate division data
const generateDivision = (divisionIndex: number, companyIndex: number) => {
  return {
    divisionId: `DIV-${String(companyIndex * 10 + divisionIndex).padStart(3, "0")}`,
    divisionName: randomElement(divisionTypes),
    revenue: `$${randomInt(5, 25)}B`,
    profitMargin: `${randomInt(15, 50)}%`,
    headcount: randomInt(50, 500),
    location: randomElement(cities),
  };
};

// Generate company data
const generateCompany = (companyIndex: number) => {
  const divisionsCount = randomInt(3, 7);
  const divisions = Array.from({ length: divisionsCount }, (_, i) =>
    generateDivision(i, companyIndex),
  );

  const companyNames = [
    "TechCorp",
    "FinanceHub",
    "HealthTech",
    "GlobalSystems",
    "InnovateLabs",
    "FutureTech",
    "DataWorks",
    "CloudFirst",
    "SmartSolutions",
    "NextGen",
    "PrimeVentures",
    "AlphaGroup",
    "BetaSystems",
    "GammaIndustries",
    "DeltaCorp",
  ];

  const suffixes = [
    "Global",
    "Inc",
    "Solutions",
    "Systems",
    "Ventures",
    "Group",
    "Industries",
    "Technologies",
  ];

  const founded = randomInt(1985, 2020);
  const employees = randomInt(5000, 100000);
  const marketCapValue = randomInt(10, 200);
  const revenueValue = randomInt(5, 60);

  return {
    id: companyIndex + 1,
    companyName: `${randomElement(companyNames)} ${randomElement(suffixes)}`,
    industry: randomElement(industries),
    founded,
    headquarters: randomElement(cities),
    stockSymbol: Array.from({ length: 4 }, () => String.fromCharCode(65 + randomInt(0, 25))).join(
      "",
    ),
    marketCap: `$${marketCapValue}B`,
    ceo: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
    revenue: `$${revenueValue}B`,
    employees,
    divisions,
  };
};

// Generate the sample data
const generateSampleData = (count: number = 25) => {
  return Array.from({ length: count }, (_, i) => generateCompany(i));
};

// Child grid for divisions: 6 columns with detailed metrics
const divisionHeaders: ReactHeaderObject[] = [
  { accessor: "divisionId", label: "Division ID", width: 120 },
  { accessor: "revenue", label: "Revenue", width: 120 },
  { accessor: "profitMargin", label: "Profit Margin", width: 130 },
  { accessor: "headcount", label: "Headcount", width: 110, type: "number" },
  { accessor: "location", label: "Location", width: "1fr" },
];

// Parent grid: 9 columns for companies
const companyHeaders: ReactHeaderObject[] = [
  {
    accessor: "companyName",
    label: "Company",
    width: 200,
    expandable: true,
    nestedTable: {
      defaultHeaders: divisionHeaders,
    },
  },
  { accessor: "stockSymbol", label: "Symbol", width: 100 },
  { accessor: "marketCap", label: "Market Cap", width: 120 },
  { accessor: "revenue", label: "Revenue", width: 120 },
  { accessor: "employees", label: "Employees", width: 120, type: "number" },
];

const NestedTablesDemo = ({
  height = "500px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  // Generate data once and memoize it
  const sampleData = useMemo(() => generateSampleData(25), []);

  return (
    <SimpleTable
      autoExpandColumns
      defaultHeaders={companyHeaders}
      rows={sampleData}
      rowGrouping={["divisions"]}
      getRowId={({ row }) => row.id as string}
      expandAll={false}
      columnResizing={true}
      height={height}
      theme={theme}
    />
  );
};

export default NestedTablesDemo;
