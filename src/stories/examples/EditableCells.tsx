import { useState } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import CellChangeProps from "../../types/CellChangeProps";
import Row from "../../types/Row";
import { RowId } from "../../types/RowId";
import CellValue from "../../types/CellValue";
import HeaderObject from "../../types/HeaderObject";

// Define headers with editable property and various types
const HEADERS: HeaderObject[] = [
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
    enumOptions: ["Developer", "Designer", "Manager", "Marketing", "QA"],
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
];

// Sample initial data
const ROWS = [
  {
    rowMeta: { rowId: 1 },
    rowData: {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "Developer",
      hireDate: "2020-01-15",
      isActive: true,
      salary: 85000,
    },
  },
  {
    rowMeta: { rowId: 2 },
    rowData: {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      role: "Designer",
      hireDate: "2021-03-22",
      isActive: true,
      salary: 78000,
    },
  },
  {
    rowMeta: { rowId: 3 },
    rowData: {
      id: 3,
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob@example.com",
      role: "Manager",
      hireDate: "2019-11-05",
      isActive: true,
      salary: 92000,
    },
  },
  {
    rowMeta: { rowId: 4 },
    rowData: {
      id: 4,
      firstName: "Alice",
      lastName: "Williams",
      email: "alice@example.com",
      role: "Developer",
      hireDate: "2022-01-10",
      isActive: false,
      salary: 83000,
    },
  },
  {
    rowMeta: { rowId: 5 },
    rowData: {
      id: 5,
      firstName: "Charlie",
      lastName: "Brown",
      email: "charlie@example.com",
      role: "Marketing",
      hireDate: "2021-08-17",
      isActive: true,
      salary: 76000,
    },
  },
];

const EditableCellsExample = () => {
  const [rows, setRows] = useState<Row[]>(ROWS);
  const [headers, setHeaders] = useState(HEADERS);
  const updateRowData = (
    rows: Row[],
    rowId: RowId,
    accessor: string,
    newValue: CellValue
  ): Row[] => {
    return rows.map((row) => {
      if (row.rowMeta.rowId === rowId) {
        // Found the row, update its data
        return {
          ...row,
          rowData: {
            ...row.rowData,
            [accessor]: newValue,
          },
        };
      }

      // If this row has children, recursively search them
      if (row.rowMeta.children && row.rowMeta.children.length > 0) {
        return {
          ...row,
          rowMeta: {
            ...row.rowMeta,
            children: updateRowData(row.rowMeta.children, rowId, accessor, newValue),
          },
        };
      }

      // Return the unchanged row
      return row;
    });
  };

  const onColumnOrderChange = (newHeaders: HeaderObject[]) => {
    setHeaders(newHeaders);
  };

  const updateCell = ({ accessor, newValue, row }: CellChangeProps) => {
    setRows((prevRows) => updateRowData(prevRows, row.rowMeta.rowId, accessor, newValue));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div>{headers.map((header) => header.accessor).join(", ")}</div>
      <SimpleTable
        columnResizing // Enable column resizing
        defaultHeaders={HEADERS} // Set the headers
        columnReordering // Enable draggable columns
        onCellEdit={updateCell} // Handle cell changes
        onColumnOrderChange={onColumnOrderChange} // Handle column order changes
        rows={rows} // Set rows data
        selectableCells // Enable selectable cells
        height="80vh"
      />
    </div>
  );
};

export default EditableCellsExample;
