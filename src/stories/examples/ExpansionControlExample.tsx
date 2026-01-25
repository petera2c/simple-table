import { useState, useRef } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import { HeaderObject, TableRefType } from "../..";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to ExpansionControl
export const expansionControlDefaults = {
  columnResizing: true,
  height: "calc(100dvh - 200px)",
};

const headers: HeaderObject[] = [
  { accessor: "name", label: "Name", width: 200, expandable: true, type: "string" },
  { accessor: "revenue", label: "Revenue", width: 120, type: "string" },
  { accessor: "employees", label: "Employees", width: 100, type: "number" },
  { accessor: "growth", label: "Growth", width: 100, type: "string" },
  { accessor: "region", label: "Region", width: 120, type: "string" },
  { accessor: "status", label: "Status", width: 110, type: "string" },
];

// Sample data with 3 levels: Companies → Divisions → Teams
const rows = [
  {
    id: 1,
    name: "TechCorp Global",
    revenue: "$2.4B",
    employees: 8500,
    growth: "+15%",
    region: "North America",
    status: "Expanding",
    divisions: [
      {
        id: 11,
        name: "Engineering Division",
        revenue: "$1.2B",
        employees: 3200,
        growth: "+18%",
        region: "Multiple",
        status: "Hiring",
        teams: [
          {
            id: 111,
            name: "Frontend Team",
            revenue: "$240M",
            employees: 450,
            growth: "+22%",
            region: "San Francisco",
            status: "Active",
          },
          {
            id: 112,
            name: "Backend Team",
            revenue: "$380M",
            employees: 520,
            growth: "+20%",
            region: "Seattle",
            status: "Active",
          },
          {
            id: 113,
            name: "DevOps Team",
            revenue: "$180M",
            employees: 280,
            growth: "+15%",
            region: "Austin",
            status: "Active",
          },
        ],
      },
      {
        id: 12,
        name: "Product Division",
        revenue: "$680M",
        employees: 1800,
        growth: "+12%",
        region: "Multiple",
        status: "Stable",
        teams: [
          {
            id: 121,
            name: "Design Team",
            revenue: "$120M",
            employees: 320,
            growth: "+10%",
            region: "New York",
            status: "Active",
          },
          {
            id: 122,
            name: "Research Team",
            revenue: "$200M",
            employees: 180,
            growth: "+8%",
            region: "Boston",
            status: "Active",
          },
        ],
      },
      {
        id: 13,
        name: "Sales Division",
        revenue: "$520M",
        employees: 1500,
        growth: "+10%",
        region: "Global",
        status: "Growing",
        teams: [
          {
            id: 131,
            name: "Enterprise Sales",
            revenue: "$320M",
            employees: 680,
            growth: "+12%",
            region: "Multiple",
            status: "Active",
          },
          {
            id: 132,
            name: "SMB Sales",
            revenue: "$200M",
            employees: 520,
            growth: "+8%",
            region: "Remote",
            status: "Active",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "DataFlow Systems",
    revenue: "$1.8B",
    employees: 5200,
    growth: "+20%",
    region: "Europe",
    status: "Expanding",
    divisions: [
      {
        id: 21,
        name: "Cloud Services",
        revenue: "$980M",
        employees: 2400,
        growth: "+25%",
        region: "Multiple",
        status: "Expanding",
        teams: [
          {
            id: 211,
            name: "Infrastructure",
            revenue: "$420M",
            employees: 880,
            growth: "+28%",
            region: "London",
            status: "Active",
          },
          {
            id: 212,
            name: "Platform",
            revenue: "$560M",
            employees: 920,
            growth: "+22%",
            region: "Berlin",
            status: "Active",
          },
        ],
      },
      {
        id: 22,
        name: "Analytics Division",
        revenue: "$520M",
        employees: 1600,
        growth: "+18%",
        region: "Multiple",
        status: "Growing",
        teams: [
          {
            id: 221,
            name: "Data Science",
            revenue: "$280M",
            employees: 720,
            growth: "+20%",
            region: "Amsterdam",
            status: "Active",
          },
          {
            id: 222,
            name: "Business Intelligence",
            revenue: "$240M",
            employees: 580,
            growth: "+15%",
            region: "Paris",
            status: "Active",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "InnovateLabs",
    revenue: "$950M",
    employees: 3100,
    growth: "+12%",
    region: "Asia Pacific",
    status: "Stable",
    divisions: [
      {
        id: 31,
        name: "AI Research",
        revenue: "$420M",
        employees: 1200,
        growth: "+15%",
        region: "Multiple",
        status: "Expanding",
        teams: [
          {
            id: 311,
            name: "Machine Learning",
            revenue: "$240M",
            employees: 680,
            growth: "+18%",
            region: "Singapore",
            status: "Active",
          },
          {
            id: 312,
            name: "Computer Vision",
            revenue: "$180M",
            employees: 420,
            growth: "+12%",
            region: "Tokyo",
            status: "Active",
          },
        ],
      },
      {
        id: 32,
        name: "Hardware Division",
        revenue: "$530M",
        employees: 1900,
        growth: "+10%",
        region: "Multiple",
        status: "Stable",
        teams: [
          {
            id: 321,
            name: "Chip Design",
            revenue: "$320M",
            employees: 980,
            growth: "+11%",
            region: "Seoul",
            status: "Active",
          },
          {
            id: 322,
            name: "Manufacturing",
            revenue: "$210M",
            employees: 720,
            growth: "+8%",
            region: "Taipei",
            status: "Active",
          },
        ],
      },
    ],
  },
];

const ExpansionControlExample = (props: UniversalTableProps) => {
  const tableRef = useRef<TableRefType>(null);
  const [expandedInfo, setExpandedInfo] = useState<string>("");

  const updateExpandedInfo = () => {
    const depths = tableRef.current?.getExpandedDepths();
    if (depths) {
      const depthArray = Array.from(depths).sort();
      if (depthArray.length === 0) {
        setExpandedInfo("All collapsed");
      } else {
        const depthNames = depthArray.map((d) => {
          const prop = tableRef.current?.getGroupingProperty(d);
          return `${prop} (depth ${d})`;
        });
        setExpandedInfo(`Expanded: ${depthNames.join(", ")}`);
      }
    }
  };

  const handleExpandAll = () => {
    tableRef.current?.expandAll();
    setTimeout(updateExpandedInfo, 0);
  };

  const handleCollapseAll = () => {
    tableRef.current?.collapseAll();
    setTimeout(updateExpandedInfo, 0);
  };

  const handleExpandDepth = (depth: number) => {
    tableRef.current?.expandDepth(depth);
    setTimeout(updateExpandedInfo, 0);
  };

  const handleCollapseDepth = (depth: number) => {
    tableRef.current?.collapseDepth(depth);
    setTimeout(updateExpandedInfo, 0);
  };

  const handleToggleDepth = (depth: number) => {
    tableRef.current?.toggleDepth(depth);
    setTimeout(updateExpandedInfo, 0);
  };

  const handleExpandOnlyCompanies = () => {
    tableRef.current?.setExpandedDepths(new Set([0]));
    setTimeout(updateExpandedInfo, 0);
  };

  const handleExpandCompaniesDivisions = () => {
    tableRef.current?.setExpandedDepths(new Set([0, 1]));
    setTimeout(updateExpandedInfo, 0);
  };

  const handleGetDepthInfo = () => {
    const divisionsDepth = tableRef.current?.getGroupingDepth("divisions");
    const teamsDepth = tableRef.current?.getGroupingDepth("teams");
    const depth0Prop = tableRef.current?.getGroupingProperty(0);
    const depth1Prop = tableRef.current?.getGroupingProperty(1);

    alert(
      `Depth Info:\n\n` +
        `"divisions" is at depth: ${divisionsDepth}\n` +
        `"teams" is at depth: ${teamsDepth}\n\n` +
        `Depth 0 property: ${depth0Prop}\n` +
        `Depth 1 property: ${depth1Prop}`
    );
  };

  return (
    <div>
      <div
        style={{
          padding: "16px",
          background: "#f5f5f5",
          borderBottom: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
          Expansion Control API Demo
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={handleExpandAll}
            style={{
              padding: "8px 16px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            expandAll()
          </button>
          <button
            onClick={handleCollapseAll}
            style={{
              padding: "8px 16px",
              background: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            collapseAll()
          </button>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => handleExpandDepth(0)}
            style={{
              padding: "8px 16px",
              background: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            expandDepth(0) - Companies
          </button>
          <button
            onClick={() => handleExpandDepth(1)}
            style={{
              padding: "8px 16px",
              background: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            expandDepth(1) - Divisions
          </button>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => handleCollapseDepth(0)}
            style={{
              padding: "8px 16px",
              background: "#FF9800",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            collapseDepth(0) - Companies
          </button>
          <button
            onClick={() => handleCollapseDepth(1)}
            style={{
              padding: "8px 16px",
              background: "#FF9800",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            collapseDepth(1) - Divisions
          </button>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => handleToggleDepth(0)}
            style={{
              padding: "8px 16px",
              background: "#9C27B0",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            toggleDepth(0)
          </button>
          <button
            onClick={() => handleToggleDepth(1)}
            style={{
              padding: "8px 16px",
              background: "#9C27B0",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            toggleDepth(1)
          </button>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={handleExpandOnlyCompanies}
            style={{
              padding: "8px 16px",
              background: "#607D8B",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            setExpandedDepths([0]) - Only Companies
          </button>
          <button
            onClick={handleExpandCompaniesDivisions}
            style={{
              padding: "8px 16px",
              background: "#607D8B",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            setExpandedDepths([0, 1]) - Companies & Divisions
          </button>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={updateExpandedInfo}
            style={{
              padding: "8px 16px",
              background: "#00BCD4",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            getExpandedDepths()
          </button>
          <button
            onClick={handleGetDepthInfo}
            style={{
              padding: "8px 16px",
              background: "#00BCD4",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            getGroupingProperty() / getGroupingDepth()
          </button>
        </div>

        {expandedInfo && (
          <div
            style={{
              padding: "8px 12px",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "13px",
              fontFamily: "monospace",
            }}
          >
            {expandedInfo}
          </div>
        )}

        <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
          <strong>Hierarchy:</strong> Companies (depth 0) → Divisions (depth 1) → Teams (depth 2)
          <br />
          Try the buttons above to control expansion programmatically via the tableRef API!
        </div>
      </div>

      <SimpleTable
        {...props}
        tableRef={tableRef}
        defaultHeaders={headers}
        rows={rows}
        rowGrouping={["divisions", "teams"]}
        expandAll={false}
        columnResizing={props.columnResizing ?? true}
        height={props.height ?? "calc(100dvh - 200px)"}
      />
    </div>
  );
};

export default ExpansionControlExample;
