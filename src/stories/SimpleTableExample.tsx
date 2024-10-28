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
        columnResizing
        draggable
        editColumns
        defaultHeaders={SAMPLE_HEADERS}
        height="auto"
        // height="calc(100dvh - 4rem)"
        rows={rows}
        onCellChange={updateCell}
        selectableCells
        shouldPaginate
        rowsPerPage={5}
      />
    </div>
  );
};
