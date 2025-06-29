import React, { useState, useMemo } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import HeaderObject from "../../types/HeaderObject";
import Row from "../../types/Row";
import SortConfig from "../../types/SortConfig";

// Sample data
const sampleData: Row[] = [
  { id: 1, name: "John Doe", age: 30, email: "john@example.com", salary: 75000 },
  { id: 2, name: "Jane Smith", age: 25, email: "jane@example.com", salary: 65000 },
  { id: 3, name: "Bob Johnson", age: 35, email: "bob@example.com", salary: 85000 },
  { id: 4, name: "Alice Brown", age: 28, email: "alice@example.com", salary: 70000 },
  { id: 5, name: "Charlie Wilson", age: 32, email: "charlie@example.com", salary: 80000 },
];

const headers: HeaderObject[] = [
  {
    accessor: "name",
    label: "Name",
    width: 150,
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
    accessor: "email",
    label: "Email",
    width: 200,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    isSortable: true,
    type: "number",
    cellRenderer: ({ row }) => `$${(row.salary || 0).toLocaleString()}`,
  },
];

const ExternalSortExample: React.FC = () => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [sortLog, setSortLog] = useState<string[]>([]);

  // Sort data externally based on sortConfig
  const sortedData = useMemo(() => {
    if (!sortConfig) return sampleData;

    const sorted = [...sampleData].sort((a, b) => {
      const accessor = sortConfig.key.accessor;
      const aValue = a[accessor];
      const bValue = b[accessor];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (sortConfig.key.type === "number") {
        comparison = (aValue as number) - (bValue as number);
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === "ascending" ? comparison : -comparison;
    });

    return sorted;
  }, [sortConfig]);

  const handleSortChange = (newSort: SortConfig | null) => {
    setSortConfig(newSort);

    // Log the sort change for demonstration
    const logEntry = newSort
      ? `Sorted by ${newSort.key.label} (${newSort.direction})`
      : "Sort cleared";

    setSortLog((prev) => [logEntry, ...prev.slice(0, 4)]); // Keep last 5 entries
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>External Sort Handling Example</h2>
      <p>
        This example demonstrates <code>externalSortHandling=true</code> and{" "}
        <code>onSortChange</code>. The table provides the sort UI, but all sorting logic is handled
        externally.
      </p>

      {/* Sort Log */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Sort Log:</h3>
        <div
          style={{
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
            minHeight: "60px",
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        >
          {sortLog.length === 0 ? (
            <em>No sort actions yet. Click a column header to sort.</em>
          ) : (
            sortLog.map((entry, index) => (
              <div key={index} style={{ marginBottom: "4px" }}>
                {entry}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Current Sort State */}
      <div style={{ marginBottom: "20px", fontSize: "14px" }}>
        <strong>Current Sort:</strong>{" "}
        {sortConfig ? `${sortConfig.key.label} (${sortConfig.direction})` : "None"}
      </div>

      <SimpleTable
        defaultHeaders={headers}
        rows={sortedData} // We provide the pre-sorted data
        rowIdAccessor="id"
        externalSortHandling={true} // Enable external sort handling
        onSortChange={handleSortChange} // Handle sort changes externally
        height="400px"
        theme="light"
      />

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <p>
          <strong>How it works:</strong>
        </p>
        <ul>
          <li>The table provides the sorting UI (clickable headers, sort icons)</li>
          <li>
            When you click a header, <code>onSortChange</code> is called with the sort configuration
          </li>
          <li>We handle the sorting logic externally and provide pre-sorted data to the table</li>
          <li>
            The table doesn't apply any internal sorting since{" "}
            <code>externalSortHandling=true</code>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ExternalSortExample;
