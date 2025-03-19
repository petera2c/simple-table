import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import { generateFinanceData, FINANCE_HEADERS } from "../data/finance-data";
import CellChangeProps from "../../types/CellChangeProps";

/**
 * # Editable Cells Example
 *
 * This example demonstrates the cell editing capabilities of Simple Table.
 *
 * ## Features Demonstrated
 * - Editing cell values by clicking or double-clicking on cells
 * - Handling cell value updates through the onCellChange callback
 * - Maintaining state consistency when cell values change
 * - Combining editable cells with other features like column resizing
 *
 * The editable cells functionality provides a seamless way for users to
 * interact with and modify data directly within the table. The component
 * handles focus management and maintains appropriate state updates.
 */

const EXAMPLE_DATA = generateFinanceData();
const HEADERS = FINANCE_HEADERS;

const EditableCellsExample = () => {
  const [rows, setRows] = useState(EXAMPLE_DATA);

  const updateCell = ({ accessor, newRowIndex, newValue, originalRowIndex, row }: CellChangeProps) => {
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
        height="80vh"
      />
    </div>
  );
};

export default EditableCellsExample;
