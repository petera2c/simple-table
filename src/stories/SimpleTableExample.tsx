import { useState } from "react";
import SimpleTable from "../components/SimpleTable/SimpleTable";
import { SAMPLE_HEADERS } from "../consts/SampleData";
import { inventoryData } from "../consts/SampleData";
import "../styles/simple-table.css";
import CellChangeProps from "../types/CellChangeProps";

export const SampleTable = () => {
  // const [headers, setHeaders] = useState(SAMPLE_HEADERS);
  const [, setRows] = useState(inventoryData);

  const updateCell = ({
    accessor,
    newRowIndex,
    newValue,
    originalRowIndex,
    row,
  }: CellChangeProps) => {
    console.log(accessor, newRowIndex, newValue, originalRowIndex, row);
    setRows((prevRows) => {
      let newRows = [...prevRows];
      newRows[originalRowIndex][accessor] = newValue;
      console.log(newRows);
      return newRows;
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        defaultHeaders={SAMPLE_HEADERS}
        // height="auto"
        height="calc(100dvh - 4rem)"
        rows={inventoryData}
        shouldPaginate={false}
        onCellChange={updateCell}
      />
    </div>
  );
};
