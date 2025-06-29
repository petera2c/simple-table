import { useState } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import { generateSaaSData, SAAS_HEADERS } from "../data/saas-data";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to Pagination - exported for reuse in stories and tests
export const paginationDefaults = {
  shouldPaginate: true,
  rowsPerPage: 10,
  columnReordering: true,
  columnResizing: true,
  selectableCells: true,
  selectableColumns: true,
};

const ROWS_PER_PAGE = 10;

const EXAMPLE_DATA = generateSaaSData();
const HEADERS = SAAS_HEADERS;

/**
 * Example showing pagination with "server-side" data fetching simulation
 */
const PaginationExample = (props: UniversalTableProps) => {
  // Only hold the current page data, not all data
  const [rows, setRows] = useState(EXAMPLE_DATA.slice(0, ROWS_PER_PAGE));

  // Handler for next page data fetch
  const onNextPage = async (pageIndex: number) => {
    const startIndex = pageIndex * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    // Create a promise to mimic async data fetching
    await new Promise((resolve) => setTimeout(resolve, 100));
    const newPageData = EXAMPLE_DATA.slice(startIndex, endIndex);
    if (newPageData.length === 0 || rows.length > startIndex) {
      return false;
    }

    setRows((prevRows) => [...prevRows, ...newPageData]);
    return true;
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem", padding: "1rem" }}>
        <h2>Server-Side Pagination Example</h2>
        <p>This example simulates fetching data from a server. Check console for details.</p>
      </div>

      <SimpleTable
        {...props}
        defaultHeaders={HEADERS}
        onNextPage={onNextPage}
        rows={rows}
        rowIdAccessor="id"
        // Default settings for this example
        shouldPaginate={props.shouldPaginate ?? true}
        rowsPerPage={props.rowsPerPage ?? ROWS_PER_PAGE}
        columnReordering={props.columnReordering ?? true}
        columnResizing={props.columnResizing ?? true}
        selectableCells={props.selectableCells ?? true}
        selectableColumns={props.selectableColumns ?? true}
        theme={props.theme ?? "dark"}
      />
    </div>
  );
};

export default PaginationExample;
