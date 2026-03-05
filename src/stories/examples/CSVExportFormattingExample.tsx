import React, { useRef } from "react";
import { SimpleTable } from "../..";
import HeaderObject from "../../types/HeaderObject";
import Row from "../../types/Row";
import { UniversalTableProps } from "./StoryWrapper";
import TableRefType from "../../types/TableRefType";

// Sample data
const sampleData: Row[] = [
  {
    id: 1,
    employeeName: "John Doe",
    email: "john.doe@company.com",
    annualSalary: 85000,
    monthlyBonus: 2500,
    completionRate: 0.92,
    startDate: "2020-03-15",
    department: "engineering",
    level: 3,
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    email: "jane.smith@company.com",
    annualSalary: 95000,
    monthlyBonus: 3200,
    completionRate: 0.88,
    startDate: "2019-07-22",
    department: "product",
    level: 4,
  },
  {
    id: 3,
    employeeName: "Bob Johnson",
    email: "bob.johnson@company.com",
    annualSalary: 72000,
    monthlyBonus: 1800,
    completionRate: 0.95,
    startDate: "2021-11-10",
    department: "sales",
    level: 2,
  },
  {
    id: 4,
    employeeName: "Alice Williams",
    email: "alice.williams@company.com",
    annualSalary: 110000,
    monthlyBonus: 4500,
    completionRate: 0.91,
    startDate: "2018-01-08",
    department: "engineering",
    level: 5,
  },
  {
    id: 5,
    employeeName: "Charlie Brown",
    email: "charlie.brown@company.com",
    annualSalary: 68000,
    monthlyBonus: 1500,
    completionRate: 0.87,
    startDate: "2022-05-20",
    department: "marketing",
    level: 2,
  },
];

const headers: HeaderObject[] = [
  {
    accessor: "employeeName",
    label: "Employee",
    width: 150,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "email",
    label: "Email",
    width: 200,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "annualSalary",
    label: "Annual Salary",
    width: 150,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) => {
      if (typeof value === "number") {
        return `$${(value / 1000).toFixed(0)}K`;
      }
      return String(value);
    },
    // Export the formatted value to CSV
    useFormattedValueForCSV: true,
    tooltip: "CSV export will show formatted value like '$85K'",
  },
  {
    accessor: "monthlyBonus",
    label: "Monthly Bonus",
    width: 150,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) => {
      if (typeof value === "number") {
        return `$${value.toLocaleString()}`;
      }
      return String(value);
    },
    // Export raw value to CSV (default)
    useFormattedValueForCSV: false,
    tooltip: "CSV export will show raw numeric value",
  },
  {
    accessor: "completionRate",
    label: "Completion Rate",
    width: 150,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) => {
      if (typeof value === "number") {
        return `${(value * 100).toFixed(1)}%`;
      }
      return String(value);
    },
    // Custom export function for CSV
    exportValueGetter: ({ value, formattedValue }) => {
      // In CSV, we want percentage without decimals
      if (typeof value === "number") {
        return `${Math.round(value * 100)}%`;
      }
      return String(formattedValue || value);
    },
    tooltip: "CSV export uses custom exportValueGetter (whole percentage)",
  },
  {
    accessor: "startDate",
    label: "Start Date",
    width: 140,
    isSortable: true,
    type: "date",
    valueFormatter: ({ value }) => {
      if (typeof value === "string") {
        return new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      return String(value);
    },
    useFormattedValueForCSV: true,
    tooltip: "CSV export shows formatted date",
  },
  {
    accessor: "department",
    label: "Department",
    width: 130,
    isSortable: true,
    type: "string",
    valueFormatter: ({ value }) => {
      const str = String(value);
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    // Custom export that adds department code
    exportValueGetter: ({ value }) => {
      const deptCodes: Record<string, string> = {
        engineering: "ENG",
        product: "PRD",
        sales: "SLS",
        marketing: "MKT",
      };
      const code = deptCodes[String(value)] || "OTH";
      const name = String(value).charAt(0).toUpperCase() + String(value).slice(1);
      return `${name} (${code})`;
    },
    tooltip: "CSV export adds department code using exportValueGetter",
  },
  {
    accessor: "level",
    label: "Level",
    width: 100,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) => {
      const levels = ["Intern", "Junior", "Mid", "Senior", "Lead", "Principal"];
      return levels[Number(value)] || String(value);
    },
    useFormattedValueForCSV: true,
    tooltip: "CSV export shows level name instead of number",
  },
];

export const csvExportFormattingExampleDefaults: Partial<UniversalTableProps> = {
  theme: "modern-light",
  selectableCells: false,
  height: "500px",
};

const CSVExportFormattingExample: React.FC<UniversalTableProps> = (props) => {
  const tableRef = useRef<TableRefType>(null);

  const handleExportCSV = () => {
    if (tableRef.current) {
      tableRef.current.exportToCSV({ filename: "employee-data.csv" });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>CSV Export with Custom Formatting</h2>
        <div style={{ marginTop: "10px", fontSize: "14px", lineHeight: "1.6" }}>
          <p>
            <strong>This example demonstrates CSV export options:</strong>
          </p>
          <ul>
            <li>
              <strong>useFormattedValueForCSV:</strong> When true, the CSV export uses the formatted
              value from valueFormatter (e.g., "$85K" instead of 85000).
            </li>
            <li>
              <strong>exportValueGetter:</strong> A custom function that can provide a completely
              different value for CSV export (e.g., adding department codes, rounding percentages).
            </li>
            <li>
              <strong>Priority:</strong> exportValueGetter {">"} useFormattedValueForCSV {">"} raw
              value
            </li>
          </ul>
          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              backgroundColor: "#e8f5e9",
              borderRadius: "4px",
            }}
          >
            <p>
              <strong>Column behaviors in this example:</strong>
            </p>
            <ul style={{ marginTop: "8px", marginBottom: "0" }}>
              <li>
                <strong>Annual Salary:</strong> Exports formatted "$85K" style
              </li>
              <li>
                <strong>Monthly Bonus:</strong> Exports raw numbers
              </li>
              <li>
                <strong>Completion Rate:</strong> Custom export function (whole percentages)
              </li>
              <li>
                <strong>Department:</strong> Custom export adds codes like "Engineering (ENG)"
              </li>
              <li>
                <strong>Level:</strong> Exports text like "Senior" instead of number
              </li>
            </ul>
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
      <SimpleTable tableRef={tableRef} rows={sampleData} defaultHeaders={headers} {...props} />
    </div>
  );
};

export default CSVExportFormattingExample;
