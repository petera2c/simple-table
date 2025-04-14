import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import { generateSaaSData, SAAS_HEADERS } from "../data/saas-data";

const ROWS_PER_PAGE = 10;

const EXAMPLE_DATA = generateSaaSData();
const HEADERS = SAAS_HEADERS;

/**
 * Example showing pagination with "server-side" data fetching simulation
 */
const PaginationExample = () => {
  // Only hold the current page data, not all data
  const [rows, setRows] = useState(EXAMPLE_DATA.slice(0, ROWS_PER_PAGE));

  // Handler for next page data fetch
  const onNextPage = (pageIndex: number) => {
    const startIndex = pageIndex * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    const newPageData = EXAMPLE_DATA.slice(startIndex, endIndex);

    if (newPageData.length === 0 || rows.length > startIndex) {
      return;
    }

    setRows((prevRows) => [...prevRows, ...newPageData]);
  };

  // Handler for previous page data fetch
  const onPreviousPage = (pageIndex: number) => {
    const startIndex = pageIndex * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    const newPageData = EXAMPLE_DATA.slice(startIndex, endIndex);

    if (newPageData.length === 0 || rows.length > startIndex) {
      return;
    }

    setRows((prevRows) => [...newPageData, ...prevRows]);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <h2>Server-Side Pagination Example</h2>
        <p>This example simulates fetching data from a server. Check console for details.</p>
      </div>

      <SimpleTable
        columnReordering
        columnResizing
        defaultHeaders={HEADERS}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        rows={rows}
        rowsPerPage={ROWS_PER_PAGE}
        selectableCells
        selectableColumns
        shouldPaginate
        totalPages={Math.ceil(EXAMPLE_DATA.length / ROWS_PER_PAGE)}
        theme="dark"
      />
    </div>
  );
};

export default PaginationExample;
