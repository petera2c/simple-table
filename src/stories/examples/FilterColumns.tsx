import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import { generateSpaceData, SPACE_HEADERS } from "../data/space-data";
import CellChangeProps from "../../types/CellChangeProps";

/**
 * # Filter Columns Example
 *
 * This example demonstrates the column filtering/management capabilities of Simple Table.
 *
 * ## Features Demonstrated
 * - Enabling column management with the editColumns prop
 * - Showing/hiding columns through the column management UI
 * - Reordering columns by dragging
 * - Maintaining state consistency when columns are modified
 *
 * The column management functionality allows users to customize their view
 * by showing/hiding columns according to their needs. This is particularly
 * useful for tables with many columns or when different users need different
 * views of the same data.
 */

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
      />
    </div>
  );
};

export default FilterColumnsExample;
