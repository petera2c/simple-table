import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import { generateFinanceData, FINANCE_HEADERS } from "../data/finance-data";
import CellChangeProps from "../../types/CellChangeProps";

const EXAMPLE_DATA = generateFinanceData();
const HEADERS = FINANCE_HEADERS;

const EditableCellsExample = () => {
  const [rows, setRows] = useState(EXAMPLE_DATA);

  const updateCell = ({ accessor, newValue, row }: CellChangeProps) => {
    setRows((prevRows) => {
      const rowIndex = rows.findIndex((r) => r.rowMeta.rowId === row.rowMeta.rowId);
      prevRows[rowIndex].rowData[accessor] = newValue;
      return prevRows;
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing // Enable column resizing
        defaultHeaders={HEADERS} // Set the headers
        columnReordering // Enable draggable columns
        onCellEdit={updateCell} // Handle cell changes
        rows={rows} // Set rows data
        selectableCells // Enable selectable cells
        height="80vh"
      />
      <div>hello world</div>
    </div>
  );
};

export default EditableCellsExample;
