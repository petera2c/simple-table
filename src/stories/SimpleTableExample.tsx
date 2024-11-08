import { useState } from "react";
import SimpleTable from "../components/SimpleTable/SimpleTable";
import { SAMPLE_HEADERS } from "../consts/SampleData";
import { inventoryData } from "../consts/SampleData";
import "../styles/simple-table.css";
import CellChangeProps from "../types/CellChangeProps";

export const SampleTable = () => {
  // const [headers, setHeaders] = useState(SAMPLE_HEADERS);
  const [rows, setRows] = useState(inventoryData);

  const updateCell = ({
    accessor,
    newRowIndex,
    newValue,
    originalRowIndex,
    row,
  }: CellChangeProps) => {
    setRows((prevRows) => {
      prevRows[originalRowIndex][accessor] = newValue;
      return prevRows;
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing // Enable column resizing
        defaultHeaders={SAMPLE_HEADERS} // Set the headers
        draggable // Enable draggable columns
        editColumns // Enable editing columns
        rows={rows} // Set rows data
        onCellChange={updateCell} // Handle cell changes
        selectableCells // Enable selectable cells
        // If using pagination use an auto height
        height="auto"
        shouldPaginate
        rowsPerPage={5}
        // height="calc(100dvh - 4rem)" // If not using pagination use a fixed height
      />
    </div>
  );
};
