import { useState } from "react";
import SimpleTable from "../components/SimpleTable/SimpleTable";
import { SAMPLE_HEADERS } from "../consts/SampleData";
import { inventoryData } from "../consts/SampleData";
import "../styles/simple-table.css";
import CellChangeProps from "../types/CellChangeProps";

export const SampleTable = () => {
  const [headers, setHeaders] = useState(SAMPLE_HEADERS);
  const [rows, setRows] = useState(inventoryData);

  const updateCell = ({
    colIndex,
    newValue,
    row,
    rowIndex,
  }: CellChangeProps) => {};

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
