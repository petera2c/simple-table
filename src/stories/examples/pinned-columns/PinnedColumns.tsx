import SimpleTable from "../../../components/SimpleTable/SimpleTable";
import { generateRetailSalesData, RETAIL_SALES_HEADERS } from "../../data/retail-data";

/**
 * # Pinned Columns Example
 *
 * This example demonstrates column pinning functionality in Simple Table.
 *
 * ## Features Demonstrated
 * - Fixed columns that remain visible while scrolling horizontally
 * - Left and right pinning options
 * - Maintaining proper column alignment with pinned columns
 * - Working with wide tables that require horizontal scrolling
 *
 * Column pinning is essential for tables with many columns, allowing users
 * to keep important columns (like identifiers or totals) visible while
 * scrolling through other data. This example uses retail sales data with
 * the first column (Name) pinned to the left and the last column (Total Sales)
 * pinned to the right.
 */

const EXAMPLE_DATA = generateRetailSalesData();
const HEADERS = RETAIL_SALES_HEADERS;

const PinnedColumnsExample = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing // Enable column resizing
        defaultHeaders={HEADERS} // Set the headers
        draggable // Enable draggable columns
        rows={EXAMPLE_DATA} // Set rows data
        height="calc(100dvh - 112px)" // If not using pagination use a fixed height
        selectableCells
        selectableColumns
      />
    </div>
  );
};

export default PinnedColumnsExample;
