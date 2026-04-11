import type { FooterRendererProps } from "@simple-table/react";

const CRMCustomFooter = ({
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
  isDark,
  setRowsPerPage,
}: FooterRendererProps & { isDark?: boolean; setRowsPerPage: (rowsPerPage: number) => void }) => {
  // Generate visible page numbers with current page centered
  const generateVisiblePages = (currentPage: number, totalPages: number): number[] => {
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if we have fewer than maxVisible
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate start and end to center current page
    let start = currentPage - 2;
    let end = currentPage + 2;

    // Adjust if we're near the beginning
    if (start < 1) {
      start = 1;
      end = Math.min(maxVisible, totalPages);
    }

    // Adjust if we're near the end
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, totalPages - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = generateVisiblePages(currentPage, totalPages);

  const colors = isDark
    ? {
        bg: "#0f172a",
        border: "#334155",
        text: "#cbd5e1",
        textBold: "#e2e8f0",
        inputBg: "#1e293b",
        inputBorder: "#475569",
        buttonBg: "#1e293b",
        buttonBorder: "#475569",
        buttonText: "#cbd5e1",
        activeBg: "#334155",
        activeText: "#ea580c",
      }
    : {
        bg: "white",
        border: "#e5e7eb",
        text: "#374151",
        textBold: "#374151",
        inputBg: "white",
        inputBorder: "#d1d5db",
        buttonBg: "white",
        buttonBorder: "#d1d5db",
        buttonText: "#6b7280",
        activeBg: "#fff7ed",
        activeText: "#ea580c",
      };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderTop: `1px solid ${colors.border}`,
        backgroundColor: colors.bg,
      }}
    >
      {/* Results text */}
      <p style={{ fontSize: "14px", color: colors.text, margin: 0 }}>
        Showing <span style={{ fontWeight: "500" }}>{startRow}</span> to{" "}
        <span style={{ fontWeight: "500" }}>{endRow}</span> of{" "}
        <span style={{ fontWeight: "500" }}>{totalRows}</span> results
      </p>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Page size selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label htmlFor="itemsPerPage" style={{ fontSize: "14px", color: colors.text }}>
            Show:
          </label>
          <select
            id="itemsPerPage"
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              onPageChange(1);
            }}
            style={{
              border: `1px solid ${colors.inputBorder}`,
              borderRadius: "6px",
              padding: "4px 8px",
              fontSize: "14px",
              backgroundColor: colors.inputBg,
              color: colors.text,
              cursor: "pointer",
            }}
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="10000">all</option>
          </select>
          <span style={{ fontSize: "14px", color: colors.text }}>per page</span>
        </div>

        {/* Pagination */}
        <nav
          style={{
            display: "inline-flex",
            borderRadius: "6px",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Previous button */}
          <button
            onClick={onPrevPage}
            disabled={!hasPrevPage}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px",
              borderTopLeftRadius: "6px",
              borderBottomLeftRadius: "6px",
              border: `1px solid ${colors.buttonBorder}`,
              backgroundColor: colors.buttonBg,
              fontSize: "14px",
              fontWeight: "500",
              color: colors.buttonText,
              cursor: hasPrevPage ? "pointer" : "not-allowed",
              opacity: hasPrevPage ? 1 : 0.5,
            }}
          >
            ‹
          </button>

          {/* Page buttons */}
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 16px",
                border: `1px solid ${colors.buttonBorder}`,
                backgroundColor: currentPage === page ? colors.activeBg : colors.buttonBg,
                fontSize: "14px",
                fontWeight: "500",
                color: currentPage === page ? colors.activeText : colors.text,
                cursor: "pointer",
                marginLeft: "-1px",
              }}
            >
              {page}
            </button>
          ))}

          {/* Next button */}
          <button
            onClick={onNextPage}
            disabled={!hasNextPage}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px",
              borderTopRightRadius: "6px",
              borderBottomRightRadius: "6px",
              border: `1px solid ${colors.buttonBorder}`,
              backgroundColor: colors.buttonBg,
              fontSize: "14px",
              fontWeight: "500",
              color: colors.buttonText,
              cursor: hasNextPage ? "pointer" : "not-allowed",
              opacity: hasNextPage ? 1 : 0.5,
              marginLeft: "-1px",
            }}
          >
            ›
          </button>
        </nav>
      </div>
    </div>
  );
};

export default CRMCustomFooter;
