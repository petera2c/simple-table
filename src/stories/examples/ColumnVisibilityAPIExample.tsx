import React, { useRef, useState } from "react";
import { SimpleTable } from "../..";
import HeaderObject from "../../types/HeaderObject";
import Row from "../../types/Row";
import TableRefType from "../../types/TableRefType";
import { UniversalTableProps } from "./StoryWrapper";

// Sample data
const sampleData: Row[] = [
  {
    id: 1,
    name: "Alice Johnson",
    age: 28,
    department: "Engineering",
    salary: 95000,
    status: "Active",
    location: "New York",
    email: "alice.j@company.com",
    phone: "555-0101",
  },
  {
    id: 2,
    name: "Bob Smith",
    age: 35,
    department: "Sales",
    salary: 75000,
    status: "Active",
    location: "Los Angeles",
    email: "bob.s@company.com",
    phone: "555-0102",
  },
  {
    id: 3,
    name: "Charlie Davis",
    age: 42,
    department: "Engineering",
    salary: 110000,
    status: "Active",
    location: "San Francisco",
    email: "charlie.d@company.com",
    phone: "555-0103",
  },
  {
    id: 4,
    name: "Diana Prince",
    age: 31,
    department: "Marketing",
    salary: 82000,
    status: "Inactive",
    location: "Chicago",
    email: "diana.p@company.com",
    phone: "555-0104",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    age: 29,
    department: "Sales",
    salary: 78000,
    status: "Active",
    location: "Boston",
    email: "ethan.h@company.com",
    phone: "555-0105",
  },
];

const headers: HeaderObject[] = [
  {
    accessor: "name",
    label: "Employee Name",
    width: 180,
    filterable: true,
    type: "string",
  },
  {
    accessor: "age",
    label: "Age",
    width: 80,
    filterable: true,
    type: "number",
  },
  {
    accessor: "department",
    label: "Department",
    width: 140,
    filterable: true,
    type: "string",
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    filterable: true,
    type: "number",
    valueFormatter: ({ value }) => `$${(value || 0).toLocaleString()}`,
    align: "right",
  },
  {
    accessor: "status",
    label: "Status",
    width: 100,
    filterable: true,
    type: "string",
  },
  {
    accessor: "location",
    label: "Location",
    width: 140,
    filterable: true,
    type: "string",
  },
  {
    accessor: "email",
    label: "Email",
    width: 200,
    type: "string",
  },
  {
    accessor: "phone",
    label: "Phone",
    width: 120,
    type: "string",
  },
];

// Default args specific to ColumnVisibilityAPIExample - exported for reuse in stories and tests
export const columnVisibilityAPIExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  editColumns: true,
  maxHeight: "600px",
};

const ColumnVisibilityAPIExampleComponent: React.FC<UniversalTableProps> = (props) => {
  const tableRef = useRef<TableRefType>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  // Show a status message temporarily
  const showStatus = (message: string) => {
    setStatusMessage(message);
  };

  // Toggle the column editor menu
  const handleToggleColumnEditor = () => {
    tableRef.current?.toggleColumnEditor();
    showStatus("Column editor toggled");
  };

  // Open the column editor menu
  const handleOpenColumnEditor = () => {
    tableRef.current?.toggleColumnEditor(true);
    showStatus("Column editor opened");
  };

  // Close the column editor menu
  const handleCloseColumnEditor = () => {
    tableRef.current?.toggleColumnEditor(false);
    showStatus("Column editor closed");
  };

  // Show only basic info columns
  const handleShowBasicInfo = async () => {
    await tableRef.current?.applyColumnVisibility({
      name: true,
      age: true,
      department: true,
      salary: false,
      status: false,
      location: false,
      email: false,
      phone: false,
    });
    showStatus("Showing basic info columns");
  };

  // Show only contact info columns
  const handleShowContactInfo = async () => {
    await tableRef.current?.applyColumnVisibility({
      name: true,
      age: false,
      department: false,
      salary: false,
      status: false,
      location: true,
      email: true,
      phone: true,
    });
    showStatus("Showing contact info columns");
  };

  // Show only financial info columns
  const handleShowFinancialInfo = async () => {
    await tableRef.current?.applyColumnVisibility({
      name: true,
      age: false,
      department: true,
      salary: true,
      status: true,
      location: false,
      email: false,
      phone: false,
    });
    showStatus("Showing financial info columns");
  };

  // Show all columns
  const handleShowAllColumns = async () => {
    await tableRef.current?.applyColumnVisibility({
      name: true,
      age: true,
      department: true,
      salary: true,
      status: true,
      location: true,
      email: true,
      phone: true,
    });
    showStatus("Showing all columns");
  };

  // Hide specific columns
  const handleHideContactColumns = async () => {
    await tableRef.current?.applyColumnVisibility({
      email: false,
      phone: false,
    });
    showStatus("Contact columns hidden");
  };

  // Show specific columns
  const handleShowSalaryColumn = async () => {
    await tableRef.current?.applyColumnVisibility({
      salary: true,
    });
    showStatus("Salary column shown");
  };

  return (
    <div style={{ padding: "20px" }}>
      {statusMessage && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            backgroundColor: "#d4edda",
            color: "#155724",
            border: "1px solid #c3e6cb",
            borderRadius: "4px",
          }}
        >
          {statusMessage}
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ marginTop: 0, marginBottom: "10px" }}>Column Editor Menu Control:</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={handleToggleColumnEditor}
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Toggle Column Editor
            </button>
            <button
              onClick={handleOpenColumnEditor}
              style={{
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Open Column Editor
            </button>
            <button
              onClick={handleCloseColumnEditor}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close Column Editor
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ marginTop: 0, marginBottom: "10px" }}>Column Visibility Presets:</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={handleShowBasicInfo}
              style={{
                padding: "8px 16px",
                backgroundColor: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Basic Info View
            </button>
            <button
              onClick={handleShowContactInfo}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6f42c1",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Contact Info View
            </button>
            <button
              onClick={handleShowFinancialInfo}
              style={{
                padding: "8px 16px",
                backgroundColor: "#ffc107",
                color: "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Financial View
            </button>
            <button
              onClick={handleShowAllColumns}
              style={{
                padding: "8px 16px",
                backgroundColor: "#20c997",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Show All Columns
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ marginTop: 0, marginBottom: "10px" }}>Individual Column Control:</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={handleHideContactColumns}
              style={{
                padding: "8px 16px",
                backgroundColor: "#fd7e14",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Hide Contact Columns
            </button>
            <button
              onClick={handleShowSalaryColumn}
              style={{
                padding: "8px 16px",
                backgroundColor: "#e83e8c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Show Salary Column
            </button>
          </div>
        </div>
      </div>

      <SimpleTable
        {...props}
        tableRef={tableRef}
        defaultHeaders={headers}
        rows={sampleData}
        columnResizing={props.columnResizing ?? true}
        columnReordering={props.columnReordering ?? true}
        editColumns={props.editColumns ?? true}
        height={props.height ?? "600px"}
        theme={props.theme ?? "light"}
      />
    </div>
  );
};

export default ColumnVisibilityAPIExampleComponent;
