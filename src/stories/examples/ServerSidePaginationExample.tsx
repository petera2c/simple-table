import { useState, useRef } from "react";
import { SimpleTable, TableRefType } from "../../index";
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

  // Generate 500 rows by repeating and modifying the base data
  for (let i = 0; i < 3; i++) {
    baseData.forEach((row, index) => {
      const id = i * baseData.length + index;
      largeDataset.push({ ...row, id });
    });
  }

  return largeDataset;
};

const TOTAL_SERVER_DATA = generateLargeDataset(); // 500+ total rows
const ROWS_PER_PAGE = 10;

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
  const tableRef = useRef<TableRefType | null>(null);
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

  // Example functions demonstrating the new pagination API
  const jumpToFirstPage = async () => {
    await tableRef.current?.setPage(1);
  };

  const jumpToLastPage = async () => {
    tableRef.current?.setPage(totalCount / ROWS_PER_PAGE);
  };

  const jumpToSpecificPage = async (pageNum: number) => {
    await tableRef.current?.setPage(pageNum);
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

      <div
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          background: "#e8f5e9",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: "1rem" }}>Programmatic Navigation Controls:</h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            onClick={jumpToFirstPage}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #4caf50",
              background: "white",
              cursor: "pointer",
            }}
          >
            Jump to First Page
          </button>
          <button
            onClick={jumpToLastPage}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #4caf50",
              background: "white",
              cursor: "pointer",
            }}
          >
            Jump to Last Page
          </button>
          <button
            onClick={() => jumpToSpecificPage(3)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #4caf50",
              background: "white",
              cursor: "pointer",
            }}
          >
            Jump to Page 3
          </button>
          <button
            onClick={() => {
              const current = tableRef.current?.getCurrentPage() || 1;
              const total = totalCount / ROWS_PER_PAGE;
              alert(`Current Page: ${current}\nTotal Pages: ${total}`);
            }}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #2196f3",
              background: "white",
              cursor: "pointer",
            }}
          >
            Get Pagination Info
          </button>
        </div>
      </div>

      <SimpleTable
        tableRef={tableRef}
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
        <h3 style={{ marginTop: "1rem", fontSize: "1rem" }}>New Pagination API:</h3>
        <ul style={{ margin: 0, paddingLeft: "1.5rem", fontSize: "0.875rem" }}>
          <li>
            <strong>tableRef.current.getCurrentPage()</strong> - Returns the current page number
            (1-indexed)
          </li>
          <li>
            <strong>tableRef.current.setPage(pageNumber)</strong> - Programmatically navigate to a
            specific page
          </li>
          <li>Use the buttons above to test programmatic pagination control!</li>
        </ul>
      </div>
    </div>
  );
};

export default ServerSidePaginationExample;
