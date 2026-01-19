import SimpleTable from "../../components/simple-table/SimpleTable";
import { HeaderObject } from "../..";
import { UniversalTableProps } from "./StoryWrapper";

// Sample data structure with different grid structures at each level

const sampleData= [
  {
    id: 1,
    companyName: "TechCorp Global",
    industry: "Technology",
    founded: 1998,
    headquarters: "San Francisco, CA",
    stockSymbol: "TECH",
    marketCap: "$125B",
    ceo: "Jane Smith",
    revenue: "$45B",
    employees: 50000,
    divisions: [
      {
        divisionId: "DIV-001",
        divisionName: "Cloud Services",
        revenue: "$20B",
        profitMargin: "35%",
        teams: [
          {
            teamId: "TEAM-001",
            teamName: "Infrastructure",
            manager: "John Doe",
            location: "San Francisco",
            budget: "$5M",
            headcount: 25,
            projects: 8,
            efficiency: "92%",
            satisfaction: 4.5,
            turnover: "5%",
            avgSalary: "$145K",
            topSkill: "Kubernetes",
            certifications: 15,
            remoteWorkers: 10,
            officeSpace: "5000 sq ft",
            equipment: "$250K",
            trainingHours: 120,
            innovations: 3,
            patents: 2,
            awards: "Best Team 2023",
          },
          {
            teamId: "TEAM-002",
            teamName: "Security",
            manager: "Sarah Johnson",
            location: "Austin",
            budget: "$3.5M",
            headcount: 18,
            projects: 5,
            efficiency: "88%",
            satisfaction: 4.7,
            turnover: "3%",
            avgSalary: "$155K",
            topSkill: "Penetration Testing",
            certifications: 22,
            remoteWorkers: 8,
            officeSpace: "3500 sq ft",
            equipment: "$180K",
            trainingHours: 150,
            innovations: 5,
            patents: 1,
            awards: "Security Excellence",
          },
        ],
      },
      {
        divisionId: "DIV-002",
        divisionName: "AI Research",
        revenue: "$15B",
        profitMargin: "42%",
        teams: [
          {
            teamId: "TEAM-003",
            teamName: "Machine Learning",
            manager: "Dr. Emily Chen",
            location: "Seattle",
            budget: "$8M",
            headcount: 30,
            projects: 12,
            efficiency: "95%",
            satisfaction: 4.8,
            turnover: "2%",
            avgSalary: "$175K",
            topSkill: "Deep Learning",
            certifications: 28,
            remoteWorkers: 15,
            officeSpace: "6000 sq ft",
            equipment: "$500K",
            trainingHours: 200,
            innovations: 8,
            patents: 5,
            awards: "Innovation Award",
          },
        ],
      },
      {
        divisionId: "DIV-003",
        divisionName: "Consumer Products",
        revenue: "$10B",
        profitMargin: "28%",
      },
    ],
  },
  {
    id: 2,
    companyName: "FinanceHub Inc",
    industry: "Financial Services",
    founded: 2005,
    headquarters: "New York, NY",
    stockSymbol: "FHUB",
    marketCap: "$85B",
    ceo: "Robert Williams",
    revenue: "$32B",
    employees: 35000,
    divisions: [
      {
        divisionId: "DIV-004",
        divisionName: "Investment Banking",
        revenue: "$18B",
        profitMargin: "45%",
        teams: [
          {
            teamId: "TEAM-004",
            teamName: "M&A Advisory",
            manager: "Michael Brown",
            location: "New York",
            budget: "$12M",
            headcount: 45,
            projects: 25,
            efficiency: "90%",
            satisfaction: 4.3,
            turnover: "8%",
            avgSalary: "$220K",
            topSkill: "Financial Modeling",
            certifications: 35,
            remoteWorkers: 5,
            officeSpace: "8000 sq ft",
            equipment: "$400K",
            trainingHours: 100,
            innovations: 2,
            patents: 0,
            awards: "Deal of the Year",
          },
        ],
      },
      {
        divisionId: "DIV-005",
        divisionName: "Retail Banking",
        revenue: "$14B",
        profitMargin: "32%",
      },
    ],
  },
  {
    id: 3,
    companyName: "HealthTech Solutions",
    industry: "Healthcare",
    founded: 2010,
    headquarters: "Boston, MA",
    stockSymbol: "HLTH",
    marketCap: "$42B",
    ceo: "Dr. Lisa Anderson",
    revenue: "$18B",
    employees: 22000,
  },
];


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
    nestedGrid: {
      defaultHeaders: divisionHeaders,
      autoExpandColumns: true,
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
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: "0 0 8px 0" }}>Nested Grid Structure Example</h2>
        <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
          This demonstrates completely different grid structures at each nesting level:
        </p>
        <ul style={{ margin: "8px 0", color: "#666", fontSize: "14px" }}>
          <li>
            <strong>Companies (Level 0):</strong> 9 columns - showing company overview data
          </li>
          <li>
            <strong>Divisions (Level 1):</strong> 3 columns - simplified division metrics
          </li>
          <li>
            <strong>Teams (Level 2):</strong> 19 columns - detailed team information
          </li>
        </ul>
        <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "14px" }}>
          Each level has its own independent grid structure with different column counts and headers.
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
        onRowGroupExpand={() => {
        }}
      />
    </div>
  );
};

export default NestedGridExample;