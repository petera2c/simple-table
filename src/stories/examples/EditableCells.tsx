import { useState } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import CellChangeProps from "../../types/CellChangeProps";
import Row from "../../types/Row";
import { RowId } from "../../types/RowId";
import CellValue from "../../types/CellValue";
import HeaderObject from "../../types/HeaderObject";

const HEADERS: HeaderObject[] = [
  {
    accessor: "name",
    label: "Name",
    width: 100,
    type: "string",
    isEditable: true,
  },
  {
    accessor: "age",
    label: "Age",
    width: 120,
    type: "number",
    isEditable: true,
  },
  {
    accessor: "jobTitle",
    label: "Job Title",
    width: 120,
    type: "enum",
    enumOptions: ["Engineer", "Manager", "Designer", "QA", "Other"],
    isEditable: true,
  },
  {
    accessor: "employed",
    label: "Employed",
    width: 120,
    type: "boolean",
    isEditable: true,
  },
  {
    accessor: "startDate",
    label: "Start Date",
    width: 140,
    type: "date",
    isEditable: true,
  },
];
const ROWS: Row[] = [
  {
    rowMeta: {
      rowId: "1",
    },
    rowData: {
      name: "John Doe",
      age: 30,
      jobTitle: "Engineer",
      employed: true,
      startDate: "2020-01-01",
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
