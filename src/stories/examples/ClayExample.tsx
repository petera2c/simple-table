import { useMemo, useRef, useState } from "react";
import { CellClickProps, SimpleTable, TableRefType } from "../..";
import { HeaderObject } from "../..";
import { UniversalTableProps } from "./StoryWrapper";
import Row from "../../types/Row";
import RowSelectionChangeProps from "../../types/RowSelectionChangeProps";

// Default args specific to ClayExample - exported for reuse in stories and tests
export const clayExampleDefaults = {
  columnResizing: true,
  editColumns: true,
  selectableCells: true,
  columnReordering: true,
  enableRowSelection: true,
  height: "400px",
  customTheme: {
    selectionColumnWidth: 160, // Wider to accommodate row buttons
  },
  columnBorders: true,
};

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

const ClayExampleComponent = (props: UniversalTableProps) => {
  // State to track actions for demo purposes
  const [selectedRowsInfo, setSelectedRowsInfo] = useState<Row[]>([]);
  const [lastAction, setLastAction] = useState<string>("");
  const [actionHistory, setActionHistory] = useState<string[]>([]);
  const [additionalColumns, setAdditionalColumns] = useState<HeaderObject[]>([]);
  const tableRef = useRef<TableRefType>(null);

  // Define headers
  const headers: HeaderObject[] = useMemo(
    () => [
      {
        accessor: "id",
        label: "ID",
        width: 60,
      },
      {
        accessor: "name",
        label: "Name",
        minWidth: 120,
        width: "1fr",
      },
      {
        accessor: "role",
        label: "Role",
        width: 120,
      },
      {
        accessor: "department",
        label: "Department",
        width: 120,
      },
      ...additionalColumns,
      {
        accessor: "other",
        label: "Other",
        width: 120,
        isSortable: false,
        filterable: false,
        type: "other",
        headerRenderer: ({ accessor, colIndex, header }) => (
          <div>
            <button
              onClick={() =>
                setAdditionalColumns([
                  ...additionalColumns,
                  {
                    accessor: `other-${additionalColumns.length + 1}`,
                    label: `Other ${additionalColumns.length + 1}`,
                    width: 120,

                    type: "other",
                  },
                ])
              }
            >
              add column
            </button>
          </div>
        ),
      },
    ],
    [additionalColumns]
  );

  // Sample data for the row buttons demo

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

  const handleColumnSelect = (header: HeaderObject) => {};

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
        enableHeaderEditing
        enableRowSelection={true}
        onCellClick={handleCellClick}
        onColumnSelect={handleColumnSelect}
        onRowSelectionChange={handleRowSelectionChange}
        rowButtons={rowButtons}
        rows={rows}
        selectableColumns
        tableRef={tableRef}
        headerDropdown={({ accessor, colIndex, header, isOpen, onClose, position }) => {
          if (!isOpen) return null;
          return (
            <div
              style={{
                position: "fixed",
                ...position,
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 9999,
                minWidth: "200px",
              }}
            >
              <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
                Column: {header.label || accessor}
              </div>
              <div style={{ marginBottom: "12px", fontSize: "14px", color: "#666" }}>
                Options for column management
              </div>
              <button
                onClick={() => onClose()}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          );
        }}
      />
    </div>
  );
};

export default ClayExampleComponent;
