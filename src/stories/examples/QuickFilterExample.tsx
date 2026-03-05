import React, { useState } from "react";
import { SimpleTable } from "../..";
import HeaderObject from "../../types/HeaderObject";
import Row from "../../types/Row";
import { UniversalTableProps } from "./StoryWrapper";

// Sample data with variety for testing quick filter
const sampleData: Row[] = [
  {
    id: 1,
    name: "Alice Johnson",
    age: 28,
    email: "alice.johnson@example.com",
    department: "Engineering",
    salary: 95000,
    status: "Active",
    location: "New York",
  },
  {
    id: 2,
    name: "Bob Smith",
    age: 35,
    email: "bob.smith@example.com",
    department: "Sales",
    salary: 75000,
    status: "Active",
    location: "Los Angeles",
  },
  {
    id: 3,
    name: "Charlie Davis",
    age: 42,
    email: "charlie.davis@example.com",
    department: "Engineering",
    salary: 110000,
    status: "Active",
    location: "San Francisco",
  },
  {
    id: 4,
    name: "Diana Prince",
    age: 31,
    email: "diana.prince@example.com",
    department: "Marketing",
    salary: 82000,
    status: "Inactive",
    location: "Chicago",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    age: 29,
    email: "ethan.hunt@example.com",
    department: "Sales",
    salary: 78000,
    status: "Active",
    location: "Boston",
  },
  {
    id: 6,
    name: "Fiona Green",
    age: 38,
    email: "fiona.green@example.com",
    department: "Engineering",
    salary: 105000,
    status: "Active",
    location: "Seattle",
  },
  {
    id: 7,
    name: "George Wilson",
    age: 26,
    email: "george.wilson@example.com",
    department: "Marketing",
    salary: 68000,
    status: "Active",
    location: "Austin",
  },
  {
    id: 8,
    name: "Hannah Lee",
    age: 33,
    email: "hannah.lee@example.com",
    department: "Sales",
    salary: 88000,
    status: "Inactive",
    location: "Denver",
  },
  {
    id: 9,
    name: "Ian Foster",
    age: 45,
    email: "ian.foster@example.com",
    department: "Engineering",
    salary: 120000,
    status: "Active",
    location: "New York",
  },
  {
    id: 10,
    name: "Julia Martinez",
    age: 27,
    email: "julia.martinez@example.com",
    department: "Marketing",
    salary: 72000,
    status: "Active",
    location: "Miami",
  },
];

const headers: HeaderObject[] = [
  {
    accessor: "name",
    label: "Employee Name",
    width: 180,
    type: "string",
  },
  {
    accessor: "age",
    label: "Age",
    width: 80,
    type: "number",
  },
  {
    accessor: "department",
    label: "Department",
    width: 140,
    type: "string",
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    type: "number",
    valueFormatter: ({ value }) => `$${(value || 0).toLocaleString()}`,
    align: "right",
  },
  {
    accessor: "status",
    label: "Status",
    width: 100,
    type: "string",
  },
  {
    accessor: "location",
    label: "Location",
    width: 140,
    type: "string",
  },
  {
    accessor: "email",
    label: "Email",
    width: 220,
    type: "string",
  },
];

// Default args specific to QuickFilterExample - exported for reuse in stories and tests
export const quickFilterExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  maxHeight: "600px",
};

const QuickFilterExampleComponent: React.FC<UniversalTableProps> = (props) => {
  const [searchText, setSearchText] = useState("");
  const [filterMode, setFilterMode] = useState<"simple" | "smart">("simple");
  const [caseSensitive, setCaseSensitive] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Quick Filter / Global Search</h3>
        <p style={{ marginBottom: "15px", color: "#666" }}>
          Search across all columns with a single input. Supports both simple and smart search
          modes.
        </p>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search across all columns..."
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "14px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <label style={{ marginRight: "10px" }}>
              <input
                type="radio"
                value="simple"
                checked={filterMode === "simple"}
                onChange={(e) => setFilterMode(e.target.value as "simple")}
                style={{ marginRight: "5px" }}
              />
              Simple Mode
            </label>
            <label>
              <input
                type="radio"
                value="smart"
                checked={filterMode === "smart"}
                onChange={(e) => setFilterMode(e.target.value as "smart")}
                style={{ marginRight: "5px" }}
              />
              Smart Mode
            </label>
          </div>

          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              style={{ marginRight: "5px" }}
            />
            Case Sensitive
          </label>
        </div>

        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "white",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontSize: "12px",
          }}
        >
          <strong>Smart Mode Features:</strong>
          <ul style={{ marginTop: "8px", marginBottom: 0, paddingLeft: "20px" }}>
            <li>
              <strong>Multi-word:</strong> <code>alice engineering</code> → matches rows containing
              both "alice" AND "engineering"
            </li>
            <li>
              <strong>Phrase:</strong> <code>"alice johnson"</code> → matches exact phrase
            </li>
            <li>
              <strong>Negation:</strong> <code>-inactive</code> → excludes rows containing
              "inactive"
            </li>
            <li>
              <strong>Column-specific:</strong> <code>department:engineering</code> → searches only
              in department column
            </li>
            <li>
              <strong>Combine:</strong> <code>engineering -inactive location:new</code> → complex
              queries
            </li>
          </ul>
        </div>

        <div
          style={{
            marginTop: "10px",
            padding: "8px",
            backgroundColor: "#e3f2fd",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          <strong>Try these examples:</strong>
          <div style={{ marginTop: "5px" }}>
            <button
              onClick={() => setSearchText("engineering")}
              style={{
                marginRight: "5px",
                marginBottom: "5px",
                padding: "4px 8px",
                fontSize: "11px",
                border: "1px solid #2196f3",
                borderRadius: "3px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              engineering
            </button>
            <button
              onClick={() => setSearchText("alice engineering")}
              style={{
                marginRight: "5px",
                marginBottom: "5px",
                padding: "4px 8px",
                fontSize: "11px",
                border: "1px solid #2196f3",
                borderRadius: "3px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              alice engineering
            </button>
            <button
              onClick={() => setSearchText('"alice johnson"')}
              style={{
                marginRight: "5px",
                marginBottom: "5px",
                padding: "4px 8px",
                fontSize: "11px",
                border: "1px solid #2196f3",
                borderRadius: "3px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              "alice johnson"
            </button>
            <button
              onClick={() => setSearchText("-inactive")}
              style={{
                marginRight: "5px",
                marginBottom: "5px",
                padding: "4px 8px",
                fontSize: "11px",
                border: "1px solid #2196f3",
                borderRadius: "3px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              -inactive
            </button>
            <button
              onClick={() => setSearchText("department:engineering")}
              style={{
                marginRight: "5px",
                marginBottom: "5px",
                padding: "4px 8px",
                fontSize: "11px",
                border: "1px solid #2196f3",
                borderRadius: "3px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              department:engineering
            </button>
            <button
              onClick={() => setSearchText("engineering -inactive location:new")}
              style={{
                marginRight: "5px",
                marginBottom: "5px",
                padding: "4px 8px",
                fontSize: "11px",
                border: "1px solid #2196f3",
                borderRadius: "3px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              engineering -inactive location:new
            </button>
          </div>
        </div>
      </div>

      <SimpleTable
        {...props}
        defaultHeaders={headers}
        rows={sampleData}
        quickFilter={{
          text: searchText,
          mode: filterMode,
          caseSensitive: caseSensitive,
          onChange: (text) => console.log("Quick filter changed:", text),
        }}
        columnResizing={props.columnResizing ?? true}
        columnReordering={props.columnReordering ?? true}
        height={props.height ?? "600px"}
        theme={props.theme ?? "light"}
      />
    </div>
  );
};

export default QuickFilterExampleComponent;
