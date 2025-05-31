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
      const rowIndex = prevRows.findIndex((r) => r.id === row.id);
      if (rowIndex !== -1) {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], [accessor]: newValue };
        return updatedRows;
      }
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
        rowIdAccessor="id"
        height="80vh"
        editColumnsInitOpen
      />
    </div>
  );
};

export default FilterColumnsExample;
