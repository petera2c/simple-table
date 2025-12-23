import { useState } from "react";
import { CellClickProps, SimpleTable } from "../..";
import { HeaderObject } from "../..";
import { UniversalTableProps } from "./StoryWrapper";
import Row from "../../types/Row";
import RowSelectionChangeProps from "../../types/RowSelectionChangeProps";

// Default args specific to RowButtonsExample - exported for reuse in stories and tests
export const rowButtonsExampleDefaults = {
  columnResizing: true,
  editColumns: true,
  selectableCells: true,
  columnReordering: true,
  enableRowSelection: true,
  height: "400px",
  selectionColumnWidth: 160, // Wider to accommodate row buttons
  columnBorders: true,
};

// Simple button component with icon styling
const IconButton = ({
  icon,
  title,
  onClick,
  color = "#666",
  hoverColor = "#333",
}: {
  icon: string;
  title: string;
  onClick: () => void;
  color?: string;
  hoverColor?: string;
}) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      background: "none",
      border: "1px solid #ddd",
      borderRadius: "4px",
      padding: "4px 6px",
      cursor: "pointer",
      fontSize: "14px",
      color: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "28px",
      height: "24px",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = hoverColor;
      e.currentTarget.style.borderColor = hoverColor;
      e.currentTarget.style.backgroundColor = "#f8f8f8";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = color;
      e.currentTarget.style.borderColor = "#ddd";
      e.currentTarget.style.backgroundColor = "transparent";
    }}
  >
    {icon}
  </button>
);

const RowButtonsExample = (props: UniversalTableProps) => {
  // State to track actions for demo purposes
  const [selectedRowsInfo, setSelectedRowsInfo] = useState<Row[]>([]);
  const [lastAction, setLastAction] = useState<string>("");
  const [actionHistory, setActionHistory] = useState<string[]>([]);

  // Sample data for the row buttons demo
  const rows = [
    {
      id: 1,
      name: "John Doe",
      age: 28,
      role: "Developer",
      department: "Engineering",
      email: "john.doe@company.com",
      startDate: "2020-01-01",
      status: "Active",
      salary: 75000,
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      role: "Designer",
      department: "Design",
      email: "jane.smith@company.com",
      startDate: "2019-03-15",
      status: "Active",
      salary: 68000,
    },
    {
      id: 3,
      name: "Bob Johnson",
      age: 45,
      role: "Manager",
      department: "Management",
      email: "bob.johnson@company.com",
      startDate: "2018-07-20",
      status: "Active",
      salary: 95000,
    },
    {
      id: 4,
      name: "Alice Williams",
      age: 24,
      role: "Intern",
      department: "Internship",
      email: "alice.williams@company.com",
      startDate: "2023-01-10",
      status: "Active",
      salary: 35000,
    },
    {
      id: 5,
      name: "Charlie Brown",
      age: 37,
      role: "DevOps",
      department: "Engineering",
      email: "charlie.brown@company.com",
      startDate: "2021-05-12",
      status: "Active",
      salary: 82000,
    },
    {
      id: 6,
      name: "Diana Prince",
      age: 29,
      role: "Developer",
      department: "Engineering",
      email: "diana.prince@company.com",
      startDate: "2022-02-28",
      status: "Inactive",
      salary: 71000,
    },
  ];

  // Action handlers
  const handleView = (row: Row) => {
    const action = `Viewed details for ${row.name} (ID: ${row.id})`;
    setLastAction(action);
    setActionHistory((prev) => [action, ...prev.slice(0, 4)]);
  };

  const handleEdit = (row: Row) => {
    const action = `Opened edit form for ${row.name} (ID: ${row.id})`;
    setLastAction(action);
    setActionHistory((prev) => [action, ...prev.slice(0, 4)]);
  };

  const handleDelete = (row: Row) => {
    const action = `Delete requested for ${row.name} (ID: ${row.id})`;
    setLastAction(action);
    setActionHistory((prev) => [action, ...prev.slice(0, 4)]);
    // In a real app, you'd show a confirmation dialog
  };

  const handleSendEmail = (row: Row) => {
    const action = `Email opened for ${row.name} (${row.email})`;
    setLastAction(action);
    setActionHistory((prev) => [action, ...prev.slice(0, 4)]);
  };

  const handleDuplicate = (row: Row) => {
    const action = `Duplicate created for ${row.name} (ID: ${row.id})`;
    setLastAction(action);
    setActionHistory((prev) => [action, ...prev.slice(0, 4)]);
  };

  // Handle row selection changes
  const handleRowSelectionChange = ({ row, isSelected, selectedRows }: RowSelectionChangeProps) => {
    const action = isSelected ? "Selected" : "Deselected";
    setLastAction(`${action}: ${row.name} (ID: ${row.id})`);

    // Convert Set to Array for display
    const selectedRowsArray = Array.from(selectedRows)
      .map((rowId) => rows.find((r) => String(r.id) === rowId))
      .filter(Boolean) as Row[];

    setSelectedRowsInfo(selectedRowsArray);
  };

  const handleCellClick = ({ row, colIndex, accessor, value }: CellClickProps) => {};

  // Define row buttons with icons
  const rowButtons = [
    ({ row }: { row: Row }) => (
      <IconButton
        icon="👁️"
        title="View Details"
        onClick={() => handleView(row)}
        color="#0066cc"
        hoverColor="#004499"
      />
    ),
    ({ row }: { row: Row }) => (
      <IconButton
        icon="✏️"
        title="Edit Employee"
        onClick={() => handleEdit(row)}
        color="#ff9500"
        hoverColor="#cc7700"
      />
    ),
    ({ row }: { row: Row }) => (
      <IconButton
        icon="📧"
        title="Send Email"
        onClick={() => handleSendEmail(row)}
        color="#28a745"
        hoverColor="#1e7e34"
      />
    ),
    ({ row }: { row: Row }) => (
      <IconButton
        icon="📋"
        title="Duplicate"
        onClick={() => handleDuplicate(row)}
        color="#6c757d"
        hoverColor="#495057"
      />
    ),
    ({ row }: { row: Row }) => (
      <IconButton
        icon="🗑️"
        title="Delete Employee"
        onClick={() => handleDelete(row)}
        color="#dc3545"
        hoverColor="#bd2130"
      />
    ),
  ];

  // Define headers
  const headers: HeaderObject[] = [
    {
      accessor: "id",
      label: "ID",
      width: 60,
      isSortable: true,
      filterable: true,
    },
    {
      accessor: "name",
      label: "Name",
      minWidth: 120,
      width: "1fr",
      isSortable: true,
      filterable: true,
    },
    {
      accessor: "role",
      label: "Role",
      width: 120,
      isSortable: true,
      filterable: true,
    },
    {
      accessor: "department",
      label: "Department",
      width: 120,
      isSortable: true,
      filterable: true,
    },
    {
      accessor: "email",
      label: "Email",
      width: 180,
      isSortable: true,
      filterable: true,
    },
    {
      accessor: "status",
      label: "Status",
      width: 80,
      isSortable: true,
      filterable: true,
      cellRenderer: ({ accessor, colIndex, row, theme }) => (
        <span
          style={{
            color: row.status === "Active" ? "#28a745" : "#ffc107",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          {String(row.status)}
        </span>
      ),
    },
    {
      accessor: "salary",
      label: "Salary",
      width: 100,
      isSortable: true,
      filterable: true,
      valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
    },
  ];

  return (
    <div>
      {/* Demo Info Panel */}
      <div
        style={{
          marginBottom: "16px",
          padding: "16px",
          backgroundColor: "#f8f9fa",
          borderRadius: "6px",
          fontSize: "14px",
          border: "1px solid #e9ecef",
        }}
      >
        <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", color: "#333" }}>Row Buttons Demo</h3>

        <div style={{ marginBottom: "12px" }}>
          <p style={{ margin: "0 0 4px 0", color: "#666" }}>
            • <strong>Hover over any row</strong> to see action buttons appear
          </p>
          <p style={{ margin: "0 0 4px 0", color: "#666" }}>
            • <strong>Select a row</strong> to keep buttons visible
          </p>
          <p style={{ margin: "0 0 8px 0", color: "#666" }}>
            • Buttons include: View 👁️, Edit ✏️, Email 📧, Duplicate 📋, Delete 🗑️
          </p>
        </div>

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <div>
            <strong>Selected Rows:</strong> {selectedRowsInfo.length}
            {selectedRowsInfo.length > 0 && (
              <span style={{ marginLeft: "8px", fontSize: "12px", color: "#666" }}>
                ({selectedRowsInfo.map((r) => r.name).join(", ")})
              </span>
            )}
          </div>

          {lastAction && (
            <div style={{ fontSize: "12px", color: "#0066cc" }}>
              <strong>Last Action:</strong> {lastAction}
            </div>
          )}
        </div>

        {actionHistory.length > 0 && (
          <div style={{ marginTop: "12px" }}>
            <strong style={{ fontSize: "12px", color: "#495057" }}>Recent Actions:</strong>
            <ul style={{ margin: "4px 0 0 16px", padding: 0, fontSize: "11px", color: "#6c757d" }}>
              {actionHistory.map((action, index) => (
                <li key={index} style={{ marginBottom: "2px" }}>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* SimpleTable with Row Buttons */}
      <SimpleTable
        {...props}
        defaultHeaders={headers}
        rows={rows}
        rowIdAccessor="id"
        enableRowSelection={true}
        rowButtons={rowButtons}
        onRowSelectionChange={handleRowSelectionChange}
        onCellClick={handleCellClick}
      />
    </div>
  );
};

export default RowButtonsExample;
