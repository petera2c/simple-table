import { useState } from "react";
import { CellClickProps, SimpleTable } from "../..";
import { HeaderObject } from "../..";
import { UniversalTableProps } from "./StoryWrapper";
import Row from "../../types/Row";
import RowSelectionChangeProps from "../../types/RowSelectionChangeProps";

// Default args specific to RowSelectionExample - exported for reuse in stories and tests
export const rowSelectionExampleDefaults = {
  columnResizing: true,
  editColumns: true,
  selectableCells: true,
  columnReordering: true,
  enableRowSelection: true,
  height: "400px",
};

const RowSelectionExample = (props: UniversalTableProps) => {
  // State to track selection for demo purposes
  const [selectedRowsInfo, setSelectedRowsInfo] = useState<Row[]>([]);
  const [lastAction, setLastAction] = useState<string>("");

  // Sample data for the row selection demo
  const rows = [
    {
      id: 1,
      name: "John Doe",
      age: 28,
      role: "Developer",
      department: "Engineering",
      startDate: "2020-01-01",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      role: "Designer",
      department: "Design",
      startDate: "2019-03-15",
      status: "Active",
    },
    {
      id: 3,
      name: "Bob Johnson",
      age: 45,
      role: "Manager",
      department: "Management",
      startDate: "2018-07-20",
      status: "Active",
    },
    {
      id: 4,
      name: "Alice Williams",
      age: 24,
      role: "Intern",
      department: "Internship",
      startDate: "2023-01-10",
      status: "Active",
    },
    {
      id: 5,
      name: "Charlie Brown",
      age: 37,
      role: "DevOps",
      department: "Engineering",
      startDate: "2021-05-12",
      status: "Active",
    },
    {
      id: 6,
      name: "Diana Prince",
      age: 29,
      role: "Developer",
      department: "Engineering",
      startDate: "2022-02-28",
      status: "Inactive",
    },
    {
      id: 7,
      name: "Ethan Hunt",
      age: 31,
      role: "Developer",
      department: "Engineering",
      startDate: "2021-09-15",
      status: "Active",
    },
    {
      id: 8,
      name: "Frank Underwood",
      age: 40,
      role: "Team Lead",
      department: "Engineering",
      startDate: "2020-11-03",
      status: "Active",
    },
    {
      id: 9,
      name: "Grace Hopper",
      age: 35,
      role: "Senior Developer",
      department: "Engineering",
      startDate: "2019-08-22",
      status: "Active",
    },
    {
      id: 10,
      name: "Hannah Montana",
      age: 22,
      role: "Junior Developer",
      department: "Engineering",
      startDate: "2023-06-01",
      status: "Active",
    },
  ];

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

  // Define headers
  const headers: HeaderObject[] = [
    {
      accessor: "id",
      label: "ID",
      width: 80,
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
      accessor: "age",
      label: "Age",
      width: 80,
      isSortable: true,
      filterable: true,
    },
    {
      accessor: "role",
      label: "Role",
      width: 140,
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
      accessor: "status",
      label: "Status",
      width: 100,
      isSortable: true,
      filterable: true,

      cellRenderer: ({ accessor, colIndex, row, theme }) => (
        <span
          style={{
            color: row.status === "Active" ? "green" : "orange",
            fontWeight: "bold",
          }}
        >
          {String(row.status)}
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Demo Info Panel */}
      <div
        style={{
          marginBottom: "16px",
          padding: "12px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          fontSize: "14px",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>Row Selection Demo</h3>
        <p style={{ margin: "0 0 8px 0" }}>
          • Click the header checkbox to select/deselect all rows
        </p>
        <p style={{ margin: "0 0 8px 0" }}>
          • Click individual row checkboxes to select/deselect specific rows
        </p>
        <div style={{ marginTop: "8px" }}>
          <strong>Selected Rows:</strong> {selectedRowsInfo.length}
          {selectedRowsInfo.length > 0 && (
            <span style={{ marginLeft: "8px", fontSize: "12px", color: "#666" }}>
              ({selectedRowsInfo.map((r) => r.name).join(", ")})
            </span>
          )}
        </div>
        {lastAction && (
          <div style={{ marginTop: "4px", fontSize: "12px", color: "#0066cc" }}>
            <strong>Last Action:</strong> {lastAction}
          </div>
        )}
      </div>

      {/* SimpleTable with Row Selection */}
      <SimpleTable
        {...props}
        defaultHeaders={headers}
        rows={rows}
        rowIdAccessor="id"
        enableRowSelection={true}
        onRowSelectionChange={handleRowSelectionChange}
        onCellClick={handleCellClick}
      />
    </div>
  );
};

export default RowSelectionExample;
