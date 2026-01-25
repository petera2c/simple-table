import SimpleTable from "../../components/simple-table/SimpleTable";
import { HeaderObject } from "../..";
import { UniversalTableProps } from "./StoryWrapper";
import { useMemo } from "react";

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

// Generate team data
const generateTeam = (teamIndex: number, divisionIndex: number, companyIndex: number) => {
  const headcount = randomInt(10, 50);
  const remoteWorkers = randomInt(0, Math.floor(headcount * 0.7));

  return {
    teamId: `TEAM-${String(companyIndex * 100 + divisionIndex * 10 + teamIndex).padStart(3, "0")}`,
    teamName: randomElement(teamTypes),
    manager: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
    location: randomElement(cities).split(", ")[0],
    budget: `$${randomFloat(1, 15, 1)}M`,
    headcount,
    projects: randomInt(3, 30),
    efficiency: `${randomInt(75, 98)}%`,
    satisfaction: randomFloat(3.5, 5.0, 1),
    turnover: `${randomInt(1, 15)}%`,
    avgSalary: `$${randomInt(80, 250)}K`,
    topSkill: randomElement(skills),
    certifications: randomInt(5, 40),
    remoteWorkers,
    officeSpace: `${randomInt(2000, 10000)} sq ft`,
    equipment: `$${randomInt(100, 800)}K`,
    trainingHours: randomInt(40, 250),
    innovations: randomInt(0, 10),
    patents: randomInt(0, 8),
    awards: randomElement(awards),
  };
};

// Generate division data
const generateDivision = (
  divisionIndex: number,
  companyIndex: number,
  hasTeams: boolean = true,
) => {
  const teamsCount = hasTeams ? randomInt(2, 5) : 0;
  const teams = Array.from({ length: teamsCount }, (_, i) =>
    generateTeam(i, divisionIndex, companyIndex),
  );

  return {
    divisionId: `DIV-${String(companyIndex * 10 + divisionIndex).padStart(3, "0")}`,
    divisionName: randomElement(divisionTypes),
    revenue: `$${randomInt(5, 25)}B`,
    profitMargin: `${randomInt(15, 50)}%`,
    ...(teams.length > 0 && { teams }),
  };
};

// Generate company data
const generateCompany = (companyIndex: number) => {
  const divisionsCount = randomInt(3, 7);
  const divisions = Array.from({ length: divisionsCount }, (_, i) => {
    // Some divisions don't have teams (to show variety)
    const hasTeams = Math.random() > 0.3;
    return generateDivision(i, companyIndex, hasTeams);
  });

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

// Child grid for divisions: only 3 columns
const divisionHeaders: HeaderObject[] = [
  { accessor: "divisionName", label: "Division", width: 250, expandable: true },
  { accessor: "revenue", label: "Revenue", width: 150 },
  { accessor: "profitMargin", label: "Profit Margin", width: 150 },
];

// Parent grid: 9 columns for companies
const companyHeaders: HeaderObject[] = [
  {
    accessor: "companyName",
    label: "Company",
    width: 200,
    expandable: true,
    nestedTable: {
      defaultHeaders: divisionHeaders,
      autoExpandColumns: true,
      enableRowSelection: true,
    },
  },
  { accessor: "industry", label: "Industry", width: 150 },
  { accessor: "founded", label: "Founded", width: 100, type: "number" },
  { accessor: "headquarters", label: "HQ", width: 180 },
  { accessor: "stockSymbol", label: "Symbol", width: 100 },
  { accessor: "marketCap", label: "Market Cap", width: 120 },
  { accessor: "ceo", label: "CEO", width: 150 },
  { accessor: "revenue", label: "Revenue", width: 120 },
  { accessor: "employees", label: "Employees", width: 120, type: "number" },
];

const NestedGridExample = (props: UniversalTableProps) => {
  // Generate data once and memoize it
  const sampleData = useMemo(() => generateSampleData(25), []);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: "0 0 8px 0" }}>Nested Grid Structure Example</h2>
        <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
          This demonstrates completely different grid structures at each nesting level with{" "}
          {sampleData.length} companies:
        </p>
        <ul style={{ margin: "8px 0", color: "#666", fontSize: "14px" }}>
          <li>
            <strong>Companies (Level 0):</strong> 9 columns - showing company overview data
          </li>
          <li>
            <strong>Divisions (Level 1):</strong> 3 columns - simplified division metrics (3-7 per
            company)
          </li>
          <li>
            <strong>Teams (Level 2):</strong> 19 columns - detailed team information (2-5 per
            division)
          </li>
        </ul>
        <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "14px" }}>
          Each level has its own independent grid structure with different column counts and
          headers. Data is procedurally generated with realistic variations.
        </p>
      </div>

      <SimpleTable
        {...props}
        defaultHeaders={companyHeaders}
        rows={sampleData}
        rowGrouping={["divisions"]}
        expandAll={false}
        columnResizing={props.columnResizing ?? true}
        height={props.height ?? "calc(100dvh - 200px)"}
        useOddEvenRowBackground
        enableRowSelection
        // shouldPaginate
      />
    </div>
  );
};

export default NestedGridExample;
