import React, { useRef, useState } from "react";
import { SimpleTable } from "../..";
import HeaderObject from "../../types/HeaderObject";
import Row from "../../types/Row";
import TableRefType from "../../types/TableRefType";
import { UniversalTableProps } from "./StoryWrapper";
import { FilterCondition } from "../../types/FilterTypes";

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
  },
  {
    id: 2,
    name: "Bob Smith",
    age: 35,
    department: "Sales",
    salary: 75000,
    status: "Active",
    location: "Los Angeles",
  },
  {
    id: 3,
    name: "Charlie Davis",
    age: 42,
    department: "Engineering",
    salary: 110000,
    status: "Active",
    location: "San Francisco",
  },
  {
    id: 4,
    name: "Diana Prince",
    age: 31,
    department: "Marketing",
    salary: 82000,
    status: "Inactive",
    location: "Chicago",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    age: 29,
    department: "Sales",
    salary: 78000,
    status: "Active",
    location: "Boston",
  },
  {
    id: 6,
    name: "Fiona Green",
    age: 38,
    department: "Engineering",
    salary: 105000,
    status: "Active",
    location: "Seattle",
  },
  {
    id: 7,
    name: "George Wilson",
    age: 26,
    department: "Marketing",
    salary: 68000,
    status: "Active",
    location: "Austin",
  },
  {
    id: 8,
    name: "Hannah Lee",
    age: 33,
    department: "Sales",
    salary: 88000,
    status: "Inactive",
    location: "Denver",
  },
  {
    id: 9,
    name: "Ian Foster",
    age: 45,
    department: "Engineering",
    salary: 120000,
    status: "Active",
    location: "New York",
  },
  {
    id: 10,
    name: "Julia Martinez",
    age: 27,
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
];

// Default args specific to ProgrammaticFilterExample - exported for reuse in stories and tests
export const programmaticFilterExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  maxHeight: "600px",
};

const ProgrammaticFilterExampleComponent: React.FC<UniversalTableProps> = (props) => {
  const tableRef = useRef<TableRefType>(null);
  const [filterInfo, setFilterInfo] = useState<string>("{}");

  // Helper function to get filter state and update display
  const updateFilterDisplay = () => {
    if (tableRef.current) {
      const currentFilters = tableRef.current.getFilterState();
      setFilterInfo(JSON.stringify(currentFilters, null, 2));
    }
  };

  // Function to get and display current filter state
  const handleGetFilterState = () => {
    updateFilterDisplay();
  };

  // Function to apply filter programmatically
  const handleApplyDepartmentFilter = async (department: string) => {
    if (tableRef.current) {
      const filter: FilterCondition = {
        accessor: "department",
        operator: "equals",
        value: department,
      };
      await tableRef.current.applyFilter(filter);
      updateFilterDisplay();
    }
  };

  const handleApplySalaryFilter = async () => {
    if (tableRef.current) {
      const filter: FilterCondition = {
        accessor: "salary",
        operator: "greaterThan",
        value: 80000,
      };
      await tableRef.current.applyFilter(filter);
      updateFilterDisplay();
    }
  };

  const handleApplyAgeRangeFilter = async () => {
    if (tableRef.current) {
      const filter: FilterCondition = {
        accessor: "age",
        operator: "between",
        values: [30, 40],
      };
      await tableRef.current.applyFilter(filter);
      updateFilterDisplay();
    }
  };

  const handleApplyNameContainsFilter = async () => {
    if (tableRef.current) {
      const filter: FilterCondition = {
        accessor: "name",
        operator: "contains",
        value: "a",
      };
      await tableRef.current.applyFilter(filter);
      updateFilterDisplay();
    }
  };

  const handleApplyStatusFilter = async () => {
    if (tableRef.current) {
      const filter: FilterCondition = {
        accessor: "status",
        operator: "equals",
        value: "Active",
      };
      await tableRef.current.applyFilter(filter);
      updateFilterDisplay();
    }
  };

  const handleApplyMultipleFilters = async () => {
    if (tableRef.current) {
      // Apply department filter
      await tableRef.current.applyFilter({
        accessor: "department",
        operator: "equals",
        value: "Engineering",
      });
      // Apply salary filter
      await tableRef.current.applyFilter({
        accessor: "salary",
        operator: "greaterThan",
        value: 90000,
      });
      updateFilterDisplay();
    }
  };

  // Clear specific filter
  const handleClearDepartmentFilter = async () => {
    if (tableRef.current) {
      await tableRef.current.clearFilter("department");
      updateFilterDisplay();
    }
  };

  // Clear all filters
  const handleClearAllFilters = async () => {
    if (tableRef.current) {
      await tableRef.current.clearAllFilters();
      updateFilterDisplay();
    }
  };

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
        <h3 style={{ marginTop: 0 }}>Programmatic Filter Control</h3>
        <p style={{ marginBottom: "15px", color: "#666" }}>
          Use the buttons below to programmatically control table filtering via the table ref API.
        </p>

        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ marginTop: 0, marginBottom: "10px" }}>Single Column Filters:</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => handleApplyDepartmentFilter("Engineering")}
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Engineering Dept
            </button>
            <button
              onClick={() => handleApplyDepartmentFilter("Sales")}
              style={{
                padding: "8px 16px",
                backgroundColor: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Sales Dept
            </button>
            <button
              onClick={handleApplySalaryFilter}
              style={{
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Salary &gt; $80k
            </button>
            <button
              onClick={handleApplyAgeRangeFilter}
              style={{
                padding: "8px 16px",
                backgroundColor: "#ffc107",
                color: "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Age 30-40
            </button>
            <button
              onClick={handleApplyNameContainsFilter}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6f42c1",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Name Contains "a"
            </button>
            <button
              onClick={handleApplyStatusFilter}
              style={{
                padding: "8px 16px",
                backgroundColor: "#20c997",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Active Status
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ marginTop: 0, marginBottom: "10px" }}>Multiple Filters:</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={handleApplyMultipleFilters}
              style={{
                padding: "8px 16px",
                backgroundColor: "#e83e8c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Eng + High Salary
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ marginTop: 0, marginBottom: "10px" }}>Filter Management:</h4>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleGetFilterState}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Get Filter State
            </button>
            <button
              onClick={handleClearDepartmentFilter}
              style={{
                padding: "8px 16px",
                backgroundColor: "#fd7e14",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Clear Dept Filter
            </button>
            <button
              onClick={handleClearAllFilters}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Clear All Filters
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "10px",
            backgroundColor: "white",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        >
          <strong>Current Filter State:</strong>
          <pre
            style={{
              marginTop: "8px",
              marginBottom: 0,
              padding: "8px",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
              fontSize: "12px",
              overflow: "auto",
              maxHeight: "200px",
            }}
          >
            {filterInfo}
          </pre>
        </div>
      </div>

      <SimpleTable
        {...props}
        tableRef={tableRef}
        defaultHeaders={headers}
        rows={sampleData}
        rowIdAccessor="id"
        columnResizing={props.columnResizing ?? true}
        columnReordering={props.columnReordering ?? true}
        height={props.height ?? "600px"}
        theme={props.theme ?? "light"}
      />
    </div>
  );
};

export default ProgrammaticFilterExampleComponent;
