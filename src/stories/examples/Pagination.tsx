import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import { generateSaaSData, SAAS_HEADERS } from "../data/saas-data";
import CellChangeProps from "../../types/CellChangeProps";

/**
 * # Pagination Example
 *
 * This example demonstrates the pagination functionality of Simple Table.
 *
 * ## Features Demonstrated
 * - Displaying data with pagination controls
 * - Configuring rows per page (set to 10)
 * - Automatic generation of page numbers and navigation controls
 * - Maintaining editable cells with pagination
 *
 * The pagination controls automatically adjust based on the total number of rows
 * and the selected rows per page. Users can navigate between pages using the
 * arrow buttons or by clicking on specific page numbers.
 */

const EXAMPLE_DATA = generateSaaSData();
const HEADERS = SAAS_HEADERS;

const PaginationExample = () => {
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
        onCellEdit={updateCell} // Handle cell changes
        rows={rows} // Set rows data
        selectableCells // Enable selectable cells
        selectableColumns // Select column by clicking on the header. This will override sort on header click
        height="80vh"
        shouldPaginate
        rowsPerPage={10}
      />
    </div>
  );
};

export default PaginationExample;
