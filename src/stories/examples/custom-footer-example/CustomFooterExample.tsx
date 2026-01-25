import { useState } from "react";
import { SimpleTable, FooterRendererProps } from "../../../index";
import { generateSaaSData } from "../../data/saas-data";

// Example custom footer component similar to the Angular example
const CustomFooter = ({
  currentPage,
  totalPages,
  rowsPerPage,
  totalRows,
  startRow,
  endRow,
  onPageChange,
  onNextPage,
  onPrevPage,
  hasNextPage,
  hasPrevPage,
}: FooterRendererProps) => {
  const [pageSize, setPageSize] = useState(rowsPerPage);

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    // In a real app, you'd call a callback here to update the parent's rowsPerPage
  };

  const renderPageButton = (pageNum: number) => {
    const isActive = currentPage === pageNum;
    return (
      <button
        key={pageNum}
        onClick={() => onPageChange(pageNum)}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          padding: "0.5rem 1rem",
          border: "1px solid #d1d5db",
          backgroundColor: isActive ? "#fff7ed" : "white",
          fontSize: "0.875rem",
          fontWeight: "500",
          color: isActive ? "#ea580c" : "#374151",
          cursor: "pointer",
        }}
      >
        {pageNum}
      </button>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      {/* Left side - Results text */}
      <div>
        <p style={{ fontSize: "0.875rem", color: "#374151" }}>
          Showing <span style={{ fontWeight: "500" }}>{startRow}</span> to{" "}
          <span style={{ fontWeight: "500" }}>{endRow}</span> of{" "}
          <span style={{ fontWeight: "500" }}>{totalRows}</span> results
        </p>
      </div>

      {/* Right side - Page size selector and pagination */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Page size selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label htmlFor="itemsPerPage" style={{ fontSize: "0.875rem", color: "#374151" }}>
            Show:
          </label>
          <select
            id="itemsPerPage"
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              padding: "0.25rem 0.5rem",
              fontSize: "0.875rem",
              backgroundColor: "white",
            }}
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="10000">all</option>
          </select>
          <span style={{ fontSize: "0.875rem", color: "#374151" }}>per page</span>
        </div>

        {/* Pagination navigation */}
        <nav
          aria-label="Pagination"
          style={{
            position: "relative",
            display: "inline-flex",
            borderRadius: "0.375rem",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Previous button */}
          <button
            onClick={onPrevPage}
            disabled={!hasPrevPage}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              padding: "0.5rem",
              borderTopLeftRadius: "0.375rem",
              borderBottomLeftRadius: "0.375rem",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#6b7280",
              cursor: hasPrevPage ? "pointer" : "not-allowed",
              opacity: hasPrevPage ? 1 : 0.5,
            }}
          >
            <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>
              Previous
            </span>
            <span>‹</span>
          </button>

          {/* Page numbers - showing first 4 pages for simplicity */}
          {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1).map(renderPageButton)}

          {/* Next button */}
          <button
            onClick={onNextPage}
            disabled={!hasNextPage}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              padding: "0.5rem",
              borderTopRightRadius: "0.375rem",
              borderBottomRightRadius: "0.375rem",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#6b7280",
              cursor: hasNextPage ? "pointer" : "not-allowed",
              opacity: hasNextPage ? 1 : 0.5,
            }}
          >
            <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>
              Next
            </span>
            <span>›</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

// Example usage
const CustomFooterExample = () => {
  const headers = [
    { accessor: "name", label: "Name", width: 200 },
    { accessor: "email", label: "Email", width: 250 },
    { accessor: "role", label: "Role", width: 150 },
    { accessor: "status", label: "Status", width: 120 },
  ];

  const rows = generateSaaSData(); // Generate 316 rows to match the example

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Custom Footer Example</h2>
      <p>This example shows how to use the footerRenderer prop to create a custom footer.</p>
      <SimpleTable
        defaultHeaders={headers}
        rows={rows}
        shouldPaginate={true}
        rowsPerPage={100}
        height={600}
        footerRenderer={(props) => <CustomFooter {...props} />}
      />
    </div>
  );
};

export default CustomFooterExample;
