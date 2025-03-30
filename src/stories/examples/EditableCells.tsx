import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import { generateFinanceData, FINANCE_HEADERS } from "../data/finance-data";
import CellChangeProps from "../../types/CellChangeProps";

const EXAMPLE_DATA = generateFinanceData();
const HEADERS = FINANCE_HEADERS;

const EditableCellsExample = () => {
  const [rows, setRows] = useState(EXAMPLE_DATA);

  const updateCell = ({ accessor, newRowIndex, newValue, originalRowIndex, row }: CellChangeProps) => {
    setRows((prevRows) => {
      prevRows[originalRowIndex].rowData[accessor] = newValue;
      return prevRows;
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing // Enable column resizing
        defaultHeaders={HEADERS} // Set the headers
        enableColumnReordering // Enable draggable columns
        onCellChange={updateCell} // Handle cell changes
        rows={rows} // Set rows data
        selectableCells // Enable selectable cells
        height="80vh"
      />
    </div>
  );
};

export default EditableCellsExample;
