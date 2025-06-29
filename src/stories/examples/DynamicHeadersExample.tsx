import { useState } from "react";
import { SimpleTable } from "../..";
import { HeaderObject } from "../..";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to DynamicHeaders - exported for reuse in stories and tests
export const dynamicHeadersDefaults = {
  columnResizing: true,
  editColumns: true,
  selectableCells: true,
};

const DynamicHeadersExample = (props: UniversalTableProps) => {
  // Sample data for testing dynamic headers
  const rows = [
    {
      id: 1,
      name: "John Doe",
      age: 28,
      role: "Developer",
      department: "Engineering",
      startDate: "2020-01-01",
      salary: 75000,
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      role: "Designer",
      department: "Design",
      startDate: "2020-01-01",
      salary: 68000,
    },
    {
      id: 3,
      name: "Bob Johnson",
      age: 45,
      role: "Manager",
      department: "Management",
      startDate: "2020-01-01",
      salary: 95000,
    },
    {
      id: 4,
      name: "Alice Williams",
      age: 24,
      role: "Intern",
      department: "Internship",
      startDate: "2020-01-01",
      salary: 35000,
    },
    {
      id: 5,
      name: "Charlie Brown",
      age: 37,
      role: "DevOps",
      department: "Engineering",
      startDate: "2020-01-01",
      salary: 82000,
    },
  ];

  // Define all possible headers
  const allHeaders: HeaderObject[] = [
    { accessor: "id", label: "ID", width: 80, isSortable: true },
    { accessor: "name", label: "Name", minWidth: 80, width: "1fr", isSortable: true },
    { accessor: "age", label: "Age", width: 100, isSortable: true },
    { accessor: "role", label: "Role", width: 150, isSortable: true },
    { accessor: "department", label: "Department", width: 150, isSortable: true },
    { accessor: "startDate", label: "Start Date", width: 120, isSortable: true },
    { accessor: "salary", label: "Salary", width: 120, isSortable: true },
  ];

  // Define reduced headers (hiding department and salary)
  const reducedHeaders: HeaderObject[] = [
    { accessor: "id", label: "ID", width: 80, isSortable: true },
    { accessor: "name", label: "Name", minWidth: 80, width: "1fr", isSortable: true },
    { accessor: "age", label: "Age", width: 100, isSortable: true },
    { accessor: "role", label: "Role", width: 150, isSortable: true },
    { accessor: "startDate", label: "Start Date", width: 120, isSortable: true },
  ];

  // Define minimal headers (only basic info)
  const minimalHeaders: HeaderObject[] = [
    { accessor: "id", label: "ID", width: 80, isSortable: true },
    { accessor: "name", label: "Name", minWidth: 80, width: "1fr", isSortable: true },
    { accessor: "role", label: "Role", width: 150, isSortable: true },
  ];

  // State to manage which headers to show
  const [currentHeaders, setCurrentHeaders] = useState<HeaderObject[]>(allHeaders);
  const [currentView, setCurrentView] = useState<"all" | "reduced" | "minimal">("all");

  // Functions to handle button clicks
  const showAllColumns = () => {
    setCurrentHeaders(allHeaders);
    setCurrentView("all");
  };

  const showReducedColumns = () => {
    setCurrentHeaders(reducedHeaders);
    setCurrentView("reduced");
  };

  const showMinimalColumns = () => {
    setCurrentHeaders(minimalHeaders);
    setCurrentView("minimal");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <h3>Dynamic Headers Example</h3>
        <p>
          This example demonstrates dynamic header updates. Use the buttons below to switch between
          different column configurations and see how the table updates in real-time.
        </p>

        <div style={{ margin: "1rem 0" }}>
          <button
            onClick={showAllColumns}
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
              backgroundColor: currentView === "all" ? "#007bff" : "#f8f9fa",
              color: currentView === "all" ? "white" : "#333",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            All Columns (7)
          </button>
          <button
            onClick={showReducedColumns}
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
              backgroundColor: currentView === "reduced" ? "#007bff" : "#f8f9fa",
              color: currentView === "reduced" ? "white" : "#333",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reduced (5)
          </button>
          <button
            onClick={showMinimalColumns}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: currentView === "minimal" ? "#007bff" : "#f8f9fa",
              color: currentView === "minimal" ? "white" : "#333",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Minimal (3)
          </button>
        </div>

        <p
          style={{
            padding: "0.5rem",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            margin: "1rem 0",
          }}
        >
          <strong>Current view:</strong>{" "}
          {currentView === "all" &&
            "All columns visible (ID, Name, Age, Role, Department, Start Date, Salary)"}
          {currentView === "reduced" &&
            "Reduced columns (ID, Name, Age, Role, Start Date) - Department & Salary hidden"}
          {currentView === "minimal" &&
            "Minimal columns (ID, Name, Role) - Age, Department, Start Date, Salary hidden"}
        </p>
      </div>

      <SimpleTable
        {...props}
        defaultHeaders={currentHeaders}
        rows={rows}
        rowIdAccessor="id"
        // Default settings for this example
        columnResizing={props.columnResizing ?? true}
        editColumns={props.editColumns ?? true}
        selectableCells={props.selectableCells ?? true}
      />
    </div>
  );
};

export default DynamicHeadersExample;
