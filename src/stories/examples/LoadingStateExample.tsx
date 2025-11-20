import { useState } from "react";
import { SimpleTable } from "../../index";
import HeaderObject from "../../types/HeaderObject";

const LoadingStateExample = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(false);

  // Sample headers
  const headers: HeaderObject[] = [
    { accessor: "id", label: "ID", width: 80 },
    { accessor: "name", label: "Name", width: 150 },
    { accessor: "email", label: "Email", width: 200 },
    { accessor: "role", label: "Role", width: 120 },
    { accessor: "status", label: "Status", width: 100 },
  ];

  // Sample data
  const sampleRows = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Developer", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Designer", status: "Active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Manager", status: "Inactive" },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice@example.com",
      role: "Developer",
      status: "Active",
    },
    {
      id: 5,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "Analyst",
      status: "Active",
    },
    { id: 6, name: "Diana Prince", email: "diana@example.com", role: "Designer", status: "Active" },
    { id: 7, name: "Eve Davis", email: "eve@example.com", role: "Developer", status: "Inactive" },
    { id: 8, name: "Frank Miller", email: "frank@example.com", role: "Manager", status: "Active" },
  ];

  const rows = showEmptyState ? [] : sampleRows;

  const handleToggleLoading = () => {
    setIsLoading(!isLoading);
  };

  const handleToggleEmptyState = () => {
    setShowEmptyState(!showEmptyState);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <button
          onClick={handleToggleLoading}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            cursor: "pointer",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {isLoading ? "Show Data" : "Show Loading"}
        </button>
        <button
          onClick={handleToggleEmptyState}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            cursor: "pointer",
            backgroundColor: "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {showEmptyState ? "Show Sample Data" : "Show Empty Data"}
        </button>
        <span style={{ fontSize: "14px" }}>
          State: {isLoading ? "Loading..." : "Loaded"} | Data: {showEmptyState ? "Empty" : "8 rows"}
        </span>
      </div>
      <SimpleTable
        defaultHeaders={headers}
        rows={rows}
        rowIdAccessor="id"
        height="500px"
        isLoading={isLoading}
      />
    </div>
  );
};

export default LoadingStateExample;
