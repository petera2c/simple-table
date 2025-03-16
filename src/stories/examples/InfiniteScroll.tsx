import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import { SAMPLE_HEADERS, inventoryData } from "../../consts/sample-data";
import CellChangeProps from "../../types/CellChangeProps";

const InfiniteScrollExample = () => {
  const [rows, setRows] = useState(inventoryData);

  const updateCell = ({
    accessor,
    newRowIndex,
    newValue,
    originalRowIndex,
    row,
  }: CellChangeProps) => {
    setRows((prevRows) => {
      prevRows[originalRowIndex].rowData[accessor] = newValue;
      return prevRows;
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing // Enable column resizing
        defaultHeaders={SAMPLE_HEADERS} // Set the headers
        draggable // Enable draggable columns
        onCellChange={updateCell} // Handle cell changes
        rows={rows} // Set rows data
        selectableCells // Enable selectable cells
        selectableColumns // Select column by clicking on the header. This will override sort on header click
        height="calc(100dvh - 112px)" // If not using pagination use a fixed height
      />
    </div>
  );
};

export default InfiniteScrollExample;
