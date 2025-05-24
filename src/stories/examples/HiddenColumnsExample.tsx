import { useState } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import { generateSpaceData, SPACE_HEADERS } from "../data/space-data";
import CellChangeProps from "../../types/CellChangeProps";

const EXAMPLE_DATA = generateSpaceData();
const HEADERS = SPACE_HEADERS;

const FilterColumnsExample = () => {
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
        editColumns // Enable column management
        onCellEdit={updateCell} // Handle cell changes
        rows={rows} // Set rows data
        height="80vh"
        editColumnsInitOpen
      />
    </div>
  );
};

export default FilterColumnsExample;
