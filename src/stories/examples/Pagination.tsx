import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import { generateSaaSData, SAAS_HEADERS } from "../data/saas-data";
import CellChangeProps from "../../types/CellChangeProps";

const EXAMPLE_DATA = generateSaaSData();
const HEADERS = SAAS_HEADERS;

const PaginationExample = () => {
  const [rows, setRows] = useState(EXAMPLE_DATA);

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
        defaultHeaders={HEADERS} // Set the headers
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
