import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import { SAMPLE_HEADERS, inventoryData } from "../../consts/SampleData";
import CellChangeProps from "../../types/CellChangeProps";

const PaginationExample = () => {
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
        onCellChange={updateCell} // Handle cell changes
        rows={rows} // Set rows data
        selectableCells // Enable selectable cells
        selectableColumns // Select column by clicking on the header. This will override sort on header click
        height="auto"
        shouldPaginate
        rowsPerPage={10}
      />
    </div>
  );
};

export default PaginationExample;
