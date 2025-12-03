import React, { useRef } from "react";
import { SimpleTable } from "../..";
import HeaderObject from "../../types/HeaderObject";
import Row from "../../types/Row";
import { UniversalTableProps } from "./StoryWrapper";
import TableRefType from "../../types/TableRefType";

// Sample data with parent and child values
const sampleData: Row[] = [
  {
    id: 1,
    name: "Product A",
    latest: { score: 85 },
    weekly_diff: { score: 5 },
    monthly_diff: { score: 12 },
    revenue: 150000,
    q1: 35000,
    q2: 38000,
    q3: 40000,
    q4: 37000,
  },
  {
    id: 2,
    name: "Product B",
    latest: { score: 92 },
    weekly_diff: { score: -2 },
    monthly_diff: { score: 8 },
    revenue: 220000,
    q1: 52000,
    q2: 58000,
    q3: 55000,
    q4: 55000,
  },
  {
    id: 3,
    name: "Product C",
    latest: { score: 78 },
    weekly_diff: { score: 3 },
    monthly_diff: { score: -5 },
    revenue: 180000,
    q1: 48000,
    q2: 45000,
    q3: 42000,
    q4: 45000,
  },
  {
    id: 4,
    name: "Product D",
    latest: { score: 88 },
    weekly_diff: { score: 7 },
    monthly_diff: { score: 15 },
    revenue: 310000,
    q1: 72000,
    q2: 75000,
    q3: 80000,
    q4: 83000,
  },
];

const headers: HeaderObject[] = [
  {
    accessor: "id",
    label: "ID",
    width: 80,
    isSortable: true,
  },
  {
    accessor: "name",
    label: "Product",
    width: 150,
    isSortable: true,
  },
  // Example 1: Parent with singleRowChildren - parent SHOULD be exported
  {
    accessor: "latest.score",
    label: "Score",
    width: 120,
    isSortable: true,
    singleRowChildren: true,
    collapsible: true,
    collapseDefault: false,
    type: "number",
    children: [
      {
        accessor: "weekly_diff.score",
        label: "7-Day Growth",
        width: 140,
        isSortable: true,
        type: "number",
        showWhen: "parentExpanded",
        valueFormatter: ({ value }) => {
          const num = Number(value);
          return num > 0 ? `+${num}` : String(num);
        },
      },
      {
        accessor: "monthly_diff.score",
        label: "30-Day Growth",
        width: 140,
        isSortable: true,
        type: "number",
        showWhen: "parentExpanded",
        valueFormatter: ({ value }) => {
          const num = Number(value);
          return num > 0 ? `+${num}` : String(num);
        },
      },
    ],
  },
  // Example 2: Parent with singleRowChildren - parent SHOULD be exported
  {
    accessor: "revenue",
    label: "Revenue",
    width: 140,
    isSortable: true,
    singleRowChildren: true,
    collapsible: true,
    collapseDefault: true,
    type: "number",
    valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
    useFormattedValueForCSV: true,
    children: [
      {
        accessor: "q1",
        label: "Q1",
        width: 120,
        isSortable: true,
        type: "number",
        showWhen: "parentExpanded",
        valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
        useFormattedValueForCSV: true,
      },
      {
        accessor: "q2",
        label: "Q2",
        width: 120,
        isSortable: true,
        type: "number",
        showWhen: "parentExpanded",
        valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
        useFormattedValueForCSV: true,
      },
      {
        accessor: "q3",
        label: "Q3",
        width: 120,
        isSortable: true,
        type: "number",
        showWhen: "parentExpanded",
        valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
        useFormattedValueForCSV: true,
      },
      {
        accessor: "q4",
        label: "Q4",
        width: 120,
        isSortable: true,
        type: "number",
        showWhen: "parentExpanded",
        valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
        useFormattedValueForCSV: true,
      },
    ],
  },
];

export const csvExportSingleRowChildrenExampleDefaults: Partial<UniversalTableProps> = {
  theme: "light",
  selectableCells: false,
  height: "500px",
};

const CSVExportSingleRowChildrenExample: React.FC<UniversalTableProps> = (props) => {
  const tableRef = useRef<TableRefType>(null);

  const handleExportCSV = () => {
    if (tableRef.current) {
      tableRef.current.exportToCSV({ filename: "single-row-children-export.csv" });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>CSV Export with singleRowChildren</h2>
        <div style={{ marginTop: "10px", fontSize: "14px", lineHeight: "1.6" }}>
          <p>
            <strong>This example demonstrates CSV export with singleRowChildren columns:</strong>
          </p>
          <ul>
            <li>
              <strong>singleRowChildren:</strong> When a parent column has this property set to
              true, the parent column is rendered on the same row as its children (not in a tree
              hierarchy).
            </li>
            <li>
              <strong>CSV Export Behavior:</strong> Parent columns with singleRowChildren are now
              properly included in the CSV export along with their children.
            </li>
            <li>
              <strong>Without singleRowChildren:</strong> Only leaf columns (children) would be
              exported, and the parent would be omitted.
            </li>
          </ul>
          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              backgroundColor: "#e3f2fd",
              borderRadius: "4px",
            }}
          >
            <p>
              <strong>Expected CSV columns in this example:</strong>
            </p>
            <ul style={{ marginTop: "8px", marginBottom: "0" }}>
              <li>
                <strong>ID</strong> - Always exported
              </li>
              <li>
                <strong>Product</strong> - Always exported
              </li>
              <li>
                <strong>Score</strong> - Parent column (exported because singleRowChildren=true)
              </li>
              <li>
                <strong>7-Day Growth</strong> - Child column (exported)
              </li>
              <li>
                <strong>30-Day Growth</strong> - Child column (exported)
              </li>
              <li>
                <strong>Revenue</strong> - Parent column (exported because singleRowChildren=true)
              </li>
              <li>
                <strong>Q1, Q2, Q3, Q4</strong> - Child columns (exported)
              </li>
            </ul>
          </div>
          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              backgroundColor: "#fff3e0",
              borderRadius: "4px",
            }}
          >
            <p style={{ margin: 0 }}>
              💡 <strong>Tip:</strong> Try expanding/collapsing the columns using the toggle buttons
              in the headers. The CSV export will include all columns regardless of their
              collapsed/expanded state.
            </p>
          </div>
        </div>
        <button
          onClick={handleExportCSV}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          📥 Export to CSV
        </button>
      </div>
      <SimpleTable
        tableRef={tableRef}
        rows={sampleData}
        defaultHeaders={headers}
        rowIdAccessor="id"
        {...props}
      />
    </div>
  );
};

export default CSVExportSingleRowChildrenExample;
