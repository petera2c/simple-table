import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import CellChangeProps from "../../types/CellChangeProps";
import Row from "../../types/Row";
import { RowId } from "../../types/RowId";
import CellValue from "../../types/CellValue";
import HeaderObject from "../../types/HeaderObject";
import data from "../examples/finance-example/finance-data.json";
import { HEADERS } from "../examples/finance-example/finance-headers";

const EXAMPLE_DATA = data;

const EditableCellsExample = () => {
  const [rows, setRows] = useState<Row[]>(EXAMPLE_DATA);
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
