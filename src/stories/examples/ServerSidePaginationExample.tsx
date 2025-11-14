import { useState } from "react";
import { SimpleTable } from "../../index";
import { generateSaaSData, SAAS_HEADERS } from "../data/saas-data";

/**
 * Example showing true server-side pagination where the server returns
 * only the rows for the current page (using offset/limit pattern).
 *
 * This demonstrates:
 * - serverSidePagination flag to disable internal slicing
 * - totalRowCount to show correct total count
 * - onPageChange callback to fetch new page data
 */

// Simulate a large dataset on the "server"
// Generate 500 rows by calling generateSaaSData multiple times
const generateLargeDataset = () => {
  const baseData = generateSaaSData();
  const largeDataset: typeof baseData = [];
  let id = 0;

  // Generate 500 rows by repeating and modifying the base data
  for (let i = 0; i < 3; i++) {
    baseData.forEach((row) => {
      largeDataset.push({ ...row, id: id++ });
    });
  }

  return largeDataset;
};

const TOTAL_SERVER_DATA = generateLargeDataset(); // 500+ total rows
const ROWS_PER_PAGE = 50;

// Simulate API call to fetch paginated data
const fetchPageData = async (page: number, pageSize: number) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  // Return only the rows for this page (like a real API would)
  const pageRows = TOTAL_SERVER_DATA.slice(offset, offset + limit);

  return {
    rows: pageRows,
    totalCount: TOTAL_SERVER_DATA.length,
  };
};

const ServerSidePaginationExample = () => {
  const [rows, setRows] = useState(TOTAL_SERVER_DATA.slice(0, ROWS_PER_PAGE));
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(TOTAL_SERVER_DATA.length);
  const [loading, setLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    console.log(`Fetching page ${page}...`);
    setLoading(true);

    try {
      const data = await fetchPageData(page, ROWS_PER_PAGE);
      setRows(data.rows);
      setTotalCount(data.totalCount);
      setCurrentPage(page);
      console.log(`✓ Loaded ${data.rows.length} rows for page ${page}`);
    } catch (error) {
      console.error("Failed to fetch page data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Server-Side Pagination Example</h2>
        <p style={{ margin: "0.5rem 0" }}>
          This example demonstrates <strong>true server-side pagination</strong> where the API
          returns only the rows for the requested page using offset/limit.
        </p>
        <div style={{ fontSize: "0.875rem", color: "#666" }}>
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Total rows on server:</strong> {totalCount}
          </p>
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Rows per page:</strong> {ROWS_PER_PAGE}
          </p>
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Current page:</strong> {currentPage}
          </p>
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Rows in memory:</strong> {rows.length} (only current page)
          </p>
          {loading && (
            <p style={{ margin: "0.5rem 0", color: "#0066cc", fontWeight: "bold" }}>
              ⏳ Loading...
            </p>
          )}
        </div>
      </div>

      <SimpleTable
        defaultHeaders={SAAS_HEADERS}
        rows={rows}
        rowIdAccessor="id"
        shouldPaginate={true}
        serverSidePagination={true}
        totalRowCount={totalCount}
        rowsPerPage={ROWS_PER_PAGE}
        onPageChange={handlePageChange}
        columnReordering={true}
        columnResizing={true}
        selectableCells={true}
        selectableColumns={true}
        theme="dark"
      />

      <div
        style={{ marginTop: "1rem", padding: "1rem", background: "#f0f9ff", borderRadius: "8px" }}
      >
        <h3 style={{ marginTop: 0, fontSize: "1rem" }}>How it works:</h3>
        <ul style={{ margin: 0, paddingLeft: "1.5rem", fontSize: "0.875rem" }}>
          <li>
            <strong>serverSidePagination={`{true}`}</strong> - Disables internal row slicing
          </li>
          <li>
            <strong>totalRowCount={`{${totalCount}}`}</strong> - Tells the table the total count
            from the server
          </li>
          <li>
            <strong>onPageChange</strong> - Called when user navigates to a new page
          </li>
          <li>
            The table only holds <strong>{rows.length} rows</strong> in memory (current page only)
          </li>
          <li>
            Without serverSidePagination, the table would try to slice rows[
            {(currentPage - 1) * ROWS_PER_PAGE}, {currentPage * ROWS_PER_PAGE}], which would be
            empty since we only have {ROWS_PER_PAGE} rows!
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ServerSidePaginationExample;
