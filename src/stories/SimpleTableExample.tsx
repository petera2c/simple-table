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
        // Enable column resizing
        columnResizing
        // Enable draggable columns
        draggable
        // Enable editing columns
        editColumns
        // Set the headers
        defaultHeaders={SAMPLE_HEADERS}
        // Set rows data
        rows={rows}
        // Handle cell changes
        onCellChange={updateCell}
        // Enable selectable cells
        selectableCells
        // If using pagination use an auto height
        // height="auto"
        // shouldPaginate
        // rowsPerPage={5}

        // If not using pagination use a fixed height
        height="calc(100dvh - 4rem)"
      />
    </div>
  );
};
