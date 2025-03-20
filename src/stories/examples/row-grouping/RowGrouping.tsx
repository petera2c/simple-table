import SimpleTable from "../../../components/SimpleTable/SimpleTable";
import { generateFinanceData, FINANCE_HEADERS } from "../../data/finance-data";

/**
 * # Row Grouping Example
 *
 * This example demonstrates hierarchical data display with row grouping in Simple Table.
 *
 * ## Features Demonstrated
 * - Displaying parent-child relationships in tabular data
 * - Expanding and collapsing grouped rows
 * - Aggregating data at parent level (like totals/counts)
 * - Visual indication of row hierarchy
 *
 * Row grouping is powerful for displaying hierarchical data structures such as:
 * - Category/subcategory breakdowns
 * - Department/team/individual hierarchies
 * - Regional/local data organization
 *
 * This example uses finance data with sectors as parent rows and companies
 * as child rows. The parent rows show aggregated totals for their children.
 */

const EXAMPLE_DATA = generateFinanceData();
const HEADERS = FINANCE_HEADERS;

const RowGroupingExample = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable columnResizing defaultHeaders={HEADERS} rows={EXAMPLE_DATA} height="calc(100dvh - 112px)" />
    </div>
  );
};

export default RowGroupingExample;
