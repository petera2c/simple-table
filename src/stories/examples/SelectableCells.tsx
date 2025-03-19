import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import { generateRetailSalesData, RETAIL_SALES_HEADERS } from "../data/retail-data";

/**
 * # Selectable Cells Example
 *
 * This example demonstrates the cell selection capabilities of Simple Table.
 *
 * ## Features Demonstrated
 * - Selecting individual cells by clicking
 * - Selecting ranges of cells by clicking and dragging
 * - Visual highlighting of selected cells
 * - Enabling selection with the selectableCells prop
 *
 * Cell selection is useful for operations like copying data, applying formatting,
 * or performing bulk operations on specific cells. The selection UI provides clear
 * visual feedback about which cells are currently selected.
 */

const EXAMPLE_DATA = generateRetailSalesData();
const HEADERS = RETAIL_SALES_HEADERS;

const SelectableCellsExample = () => {
  const [rows, setRows] = useState(EXAMPLE_DATA);

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable columnResizing defaultHeaders={HEADERS} draggable rows={rows} selectableCells height="80vh" />
    </div>
  );
};

export default SelectableCellsExample;
