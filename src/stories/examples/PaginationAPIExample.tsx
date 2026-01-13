import { useState, useRef } from "react";
import { SimpleTable, TableRefType } from "../../index";
import { generateSaaSData, SAAS_HEADERS } from "../data/saas-data";

/**
 * Example demonstrating the new Pagination API methods:
 * - getCurrentPage() - Get the current page number
 * - setPage(pageNumber) - Programmatically navigate to a specific page
 */

const EXAMPLE_DATA = generateSaaSData();
const ROWS_PER_PAGE = 10;

const PaginationAPIExample = () => {
  const tableRef = useRef<TableRefType | null>(null);
  const [currentPageInfo, setCurrentPageInfo] = useState({ current: 1 });
  const [customPageInput, setCustomPageInput] = useState("1");

  const jumpToFirstPage = async () => {
    await tableRef.current?.setPage(1);
    setCurrentPageInfo({ current: 1 });
  };

  const jumpToLastPage = async () => {
    const totalPages = EXAMPLE_DATA.length / ROWS_PER_PAGE;
    await tableRef.current?.setPage(totalPages);
    setCurrentPageInfo({ current: totalPages });
  };

  const jumpToNextPage = async () => {
    const current = tableRef.current?.getCurrentPage() || 1;
    const total = EXAMPLE_DATA.length / ROWS_PER_PAGE;
    if (current < total) {
      await tableRef.current?.setPage(current + 1);
      setCurrentPageInfo({ current: current + 1 });
    }
  };

  const jumpToPreviousPage = async () => {
    const current = tableRef.current?.getCurrentPage() || 1;
    if (current > 1) {
      await tableRef.current?.setPage(current - 1);
      setCurrentPageInfo({ current: current - 1 });
    }
  };

  const jumpToCustomPage = async () => {
    const pageNum = parseInt(customPageInput, 10);
    if (!isNaN(pageNum)) {
      await tableRef.current?.setPage(pageNum);
      setCurrentPageInfo({ current: pageNum });
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
        <h2 style={{ marginTop: 0 }}>Pagination API Example</h2>
        <p style={{ margin: "0.5rem 0" }}>
          This example demonstrates the new <strong>Pagination API</strong> that allows programmatic
          control of pagination state.
        </p>
        <div
          style={{
            fontSize: "0.875rem",
            color: "#666",
            padding: "0.5rem",
            background: "#e3f2fd",
            borderRadius: "4px",
            marginTop: "0.5rem",
          }}
        >
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Current Page:</strong> {currentPageInfo.current}
          </p>
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
        <h3 style={{ marginTop: 0, fontSize: "1rem", marginBottom: "0.75rem" }}>
          Navigation Controls:
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <button
            onClick={jumpToFirstPage}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #4caf50",
              background: "white",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            ⏮️ First Page
          </button>
          <button
            onClick={jumpToPreviousPage}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #4caf50",
              background: "white",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            ◀️ Previous
          </button>
          <button
            onClick={jumpToNextPage}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #4caf50",
              background: "white",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Next ▶️
          </button>
          <button
            onClick={jumpToLastPage}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #4caf50",
              background: "white",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            ⏭️ Last Page
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input
            type="number"
            min="1"
            max={EXAMPLE_DATA.length / ROWS_PER_PAGE}
            value={customPageInput}
            onChange={(e) => setCustomPageInput(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100px",
            }}
            placeholder="Page #"
          />
          <button
            onClick={jumpToCustomPage}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "1px solid #2196f3",
              background: "white",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Go to Page
          </button>
        </div>
      </div>

      <SimpleTable
        tableRef={tableRef}
        defaultHeaders={SAAS_HEADERS}
        rows={EXAMPLE_DATA}
        shouldPaginate={true}
        rowsPerPage={ROWS_PER_PAGE}
        columnReordering={true}
        columnResizing={true}
        selectableCells={true}
        selectableColumns={true}
        theme="dark"
        maxHeight={"200px"}
      />

      <div
        style={{ marginTop: "1rem", padding: "1rem", background: "#fff3e0", borderRadius: "8px" }}
      >
        <h3 style={{ marginTop: 0, fontSize: "1rem" }}>API Reference:</h3>
        <div style={{ fontSize: "0.875rem" }}>
          <div style={{ marginBottom: "0.5rem" }}>
            <code
              style={{
                background: "#f5f5f5",
                padding: "0.25rem 0.5rem",
                borderRadius: "3px",
                fontFamily: "monospace",
              }}
            >
              tableRef.current.getCurrentPage()
            </code>
            <p style={{ margin: "0.25rem 0 0 0", color: "#666" }}>
              Returns the current page number (1-indexed)
            </p>
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <code
              style={{
                background: "#f5f5f5",
                padding: "0.25rem 0.5rem",
                borderRadius: "3px",
                fontFamily: "monospace",
              }}
            >
              tableRef.current.getTotalPages()
            </code>
            <p style={{ margin: "0.25rem 0 0 0", color: "#666" }}>
              Returns the total number of pages based on current data and rowsPerPage
            </p>
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <code
              style={{
                background: "#f5f5f5",
                padding: "0.25rem 0.5rem",
                borderRadius: "3px",
                fontFamily: "monospace",
              }}
            >
              await tableRef.current.setPage(pageNumber)
            </code>
            <p style={{ margin: "0.25rem 0 0 0", color: "#666" }}>
              Programmatically navigates to a specific page. Returns a promise that resolves after
              the page change completes. Page numbers are 1-indexed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginationAPIExample;
