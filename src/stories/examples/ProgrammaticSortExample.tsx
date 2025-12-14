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
    performance: 4.5,
  },
  {
    id: 2,
    name: "Bob Smith",
    age: 35,
    department: "Sales",
    salary: 75000,
    performance: 4.2,
  },
  {
    id: 3,
    name: "Charlie Davis",
    age: 42,
    department: "Engineering",
    salary: 110000,
    performance: 4.8,
  },
  {
    id: 4,
    name: "Diana Prince",
    age: 31,
    department: "Marketing",
    salary: 82000,
    performance: 4.6,
  },
  {
    id: 5,
    name: "Ethan Hunt",
    age: 29,
    department: "Sales",
    salary: 78000,
    performance: 4.3,
  },
  {
    id: 6,
    name: "Fiona Green",
    age: 38,
    department: "Engineering",
    salary: 105000,
    performance: 4.7,
  },
  {
    id: 7,
    name: "George Wilson",
    age: 26,
    department: "Marketing",
    salary: 68000,
    performance: 4.0,
  },
  {
    id: 8,
    name: "Hannah Lee",
    age: 33,
    department: "Sales",
    salary: 88000,
    performance: 4.4,
  },
];

const headers: HeaderObject[] = [
  {
    accessor: "name",
    label: "Employee Name",
    width: 180,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "age",
    label: "Age",
    width: 80,
    isSortable: true,
    type: "number",
  },
  {
    accessor: "department",
    label: "Department",
    width: 140,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) => `$${(value || 0).toLocaleString()}`,
    align: "right",
  },
  {
    accessor: "performance",
    label: "Performance",
    width: 120,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) => `${value}/5.0`,
    align: "center",
  },
];

// Default args specific to ProgrammaticSortExample - exported for reuse in stories and tests
export const programmaticSortExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  height: "500px",
};

const ProgrammaticSortExampleComponent: React.FC<UniversalTableProps> = (props) => {
  const tableRef = useRef<TableRefType>(null);
  const [sortInfo, setSortInfo] = useState<string>("No sort applied");

  // Function to get and display current sort state
  const handleGetSortState = () => {
    if (tableRef.current) {
      const currentSort = tableRef.current.getSortState();
      if (currentSort) {
        setSortInfo(
          `Sorted by: ${currentSort.key.label || currentSort.key.accessor} (${
            currentSort.direction
          })`
        );
      } else {
        setSortInfo("No sort applied");
      }
    }
  };

  // Function to apply sort programmatically
  const handleApplySort = async (accessor: string, direction?: "asc" | "desc") => {
    if (tableRef.current) {
      // Find the header object for the accessor
      const header = headers.find((h) => h.accessor === accessor);
      if (header) {
        await tableRef.current.applySortState({ accessor, direction });
        setSortInfo(`Sorted by: ${header.label} (${direction})`);
      }
    }
  };

  // Clear sort
  const handleClearSort = async () => {
    if (tableRef.current) {
      await tableRef.current.applySortState();
      setSortInfo("No sort applied");
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
        <h3 style={{ marginTop: 0 }}>Programmatic Sort Control</h3>
        <p style={{ marginBottom: "15px", color: "#666" }}>
          Use the buttons below to programmatically control table sorting via the table ref API.
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
          <button
            onClick={() => handleApplySort("salary")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sort by Salary (High to Low)
          </button>
          <button
            onClick={() => handleApplySort("age", "asc")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sort by Age (Low to High)
          </button>
          <button
            onClick={() => handleApplySort("performance", "desc")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sort by Performance (High to Low)
          </button>
          <button
            onClick={() => handleApplySort("name", "asc")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6f42c1",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sort by Name (A-Z)
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <button
            onClick={handleGetSortState}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ffc107",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Get Current Sort State
          </button>
          <button
            onClick={handleClearSort}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear Sort
          </button>
        </div>

        <div
          style={{
            padding: "10px",
            backgroundColor: "white",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        >
          <strong>Current Sort:</strong> {sortInfo}
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
        height={props.height ?? "500px"}
        theme={props.theme ?? "light"}
      />
    </div>
  );
};

export default ProgrammaticSortExampleComponent;
