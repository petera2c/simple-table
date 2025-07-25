import { useState } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import CellChangeProps from "../../types/CellChangeProps";
import Row from "../../types/Row";
import { RowId } from "../../types/RowId";
import CellValue from "../../types/CellValue";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to EditableCells - exported for reuse in stories and tests
export const editableCellsDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  height: "80vh",
};

// Define headers with editable property and various types
const HEADERS: HeaderObject[] = [
  {
    accessor: "status",
    label: "Status",
    width: 130,
    isEditable: true,
    type: "enum",
    enumOptions: [
      { label: "New", value: "New" },
      { label: "In Progress", value: "In Progress" },
      { label: "Completed", value: "Completed" },
      { label: "On Hold", value: "On Hold" },
      { label: "Cancelled", value: "Cancelled" },
    ],
  },
  { accessor: "id", label: "ID", width: 80, isEditable: false, type: "number" },
  { accessor: "firstName", label: "First Name", width: 150, isEditable: true, type: "string" },
  { accessor: "lastName", label: "Last Name", width: 150, isEditable: true, type: "string" },
  {
    accessor: "email",
    label: "Email",
    minWidth: 100,
    width: "1fr",
    isEditable: true,
    type: "string",
  },
  {
    accessor: "role",
    label: "Role",
    width: 150,
    isEditable: true,
    type: "enum",
    enumOptions: [
      { label: "Developer", value: "Developer" },
      { label: "Designer", value: "Designer" },
      { label: "Manager", value: "Manager" },
      { label: "Marketing", value: "Marketing" },
      { label: "QA", value: "QA" },
    ],
  },
  {
    accessor: "hireDate",
    label: "Hire Date",
    width: 150,
    isEditable: true,
    type: "date",
  },
  {
    accessor: "isActive",
    label: "Active",
    width: 100,
    isEditable: true,
    type: "boolean",
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    isEditable: true,
    type: "number",
  },
  {
    accessor: "reviewDate",
    label: "Next Review",
    width: 150,
    isEditable: true,
    type: "date",
  },
];

// Sample initial data - using new simplified structure
const ROWS = [
  {
    id: 1,
    status: "Completed",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    role: "Developer",
    hireDate: "2020-01-15",
    isActive: true,
    salary: 85000,
    reviewDate: "2023-08-15",
  },
  {
    id: 2,
    status: "In Progress",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    role: "Designer",
    hireDate: "2021-03-22",
    isActive: true,
    salary: 78000,
    reviewDate: "2023-09-22",
  },
  {
    id: 3,
    status: "Completed",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@example.com",
    role: "Manager",
    hireDate: "2019-11-05",
    isActive: true,
    salary: 92000,
    reviewDate: "2023-07-05",
  },
  {
    id: 4,
    status: "On Hold",
    firstName: "Alice",
    lastName: "Williams",
    email: "alice@example.com",
    role: "Developer",
    hireDate: "2022-01-10",
    isActive: false,
    salary: 83000,
    reviewDate: "2023-03-10",
  },
  {
    id: 5,
    status: "New",
    firstName: "Charlie",
    lastName: "Brown",
    email: "charlie@example.com",
    role: "Marketing",
    hireDate: "2021-08-17",
    isActive: true,
    salary: 76000,
    reviewDate: "2023-03-17",
  },
];

const EditableCellsExample = (props: UniversalTableProps) => {
  const [rows, setRows] = useState<Row[]>(ROWS);

  const updateRowData = (
    rows: Row[],
    targetRowId: RowId,
    accessor: Accessor,
    newValue: CellValue
  ): Row[] => {
    return rows.map((row) => {
      if (row.id === targetRowId) {
        // Found the row, update its data directly
        return {
          ...row,
          [accessor]: newValue,
        };
      }
      // Return the unchanged row
      return row;
    });
  };

  const updateCell = ({ accessor, newValue, row }: CellChangeProps) => {
    const rowId = row.id as RowId; // Get the row ID directly from the row
    setRows((prevRows) => updateRowData(prevRows, rowId, accessor, newValue));
  };

  return (
    <SimpleTable
      {...props}
      defaultHeaders={HEADERS}
      onCellEdit={updateCell}
      rows={rows}
      rowIdAccessor="id"
      // Default settings for this example
      columnResizing={props.columnResizing ?? true}
      columnReordering={props.columnReordering ?? true}
      selectableCells={props.selectableCells ?? true}
      height={props.height ?? "80vh"}
    />
  );
};

export default EditableCellsExample;
