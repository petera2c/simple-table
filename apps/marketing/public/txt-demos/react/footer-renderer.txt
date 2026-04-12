import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme, FooterRendererProps } from "@simple-table/react";
import { footerRendererConfig } from "./footer-renderer.demo-data";
import "@simple-table/react/styles.css";

function getFooterColors(theme?: Theme) {
  const isModernDark = theme === "modern-dark";
  const isDark = theme === "dark" || isModernDark;
  const isModernLight = theme === "modern-light";
  const isLight = theme === "light" || isModernLight;

  if (isModernDark)
    return {
      background: "#1f2937", border: "#374151", text: "#d1d5db",
      buttonBg: "#374151", buttonBorder: "#4b5563", buttonActive: "#3b82f6",
      buttonText: "#d1d5db", buttonDisabled: "#6b7280",
    };
  if (isDark)
    return {
      background: "#1f2937", border: "#374151", text: "#e5e7eb",
      buttonBg: "#374151", buttonBorder: "#4b5563", buttonActive: "#3b82f6",
      buttonText: "#d1d5db", buttonDisabled: "#6b7280",
    };
  if (isLight)
    return {
      background: "white", border: "#f3f4f6", text: "#6b7280",
      buttonBg: "white", buttonBorder: "#e5e7eb", buttonActive: "#3b82f6",
      buttonText: "#374151", buttonDisabled: "#d1d5db",
    };
  return {
    background: "#f8fafc", border: "#e2e8f0", text: "#475569",
    buttonBg: "white", buttonBorder: "#e2e8f0", buttonActive: "#3b82f6",
    buttonText: "#64748b", buttonDisabled: "#cbd5e1",
  };
}

const FooterRendererDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const c = getFooterColors(theme);

  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(footerRendererConfig.headers)}
      rows={footerRendererConfig.rows}
      shouldPaginate={true}
      rowsPerPage={10}
      height={height}
      theme={theme}
      footerRenderer={({
        currentPage,
        startRow,
        endRow,
        totalRows,
        totalPages,
        hasPrevPage,
        hasNextPage,
        onPrevPage,
        onNextPage,
        onPageChange,
      }: FooterRendererProps) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            backgroundColor: c.background,
            borderTop: `2px solid ${c.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: c.text }}>
              Showing {startRow}-{endRow} of {totalRows} items
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={onPrevPage}
              disabled={!hasPrevPage}
              style={{
                padding: "8px 16px", fontSize: "14px", fontWeight: 500,
                color: hasPrevPage ? c.buttonActive : c.buttonDisabled,
                backgroundColor: c.buttonBg, border: `1px solid ${c.buttonBorder}`,
                borderRadius: "6px", cursor: hasPrevPage ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              Previous
            </button>

            <div style={{ display: "flex", gap: "4px" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  style={{
                    padding: "8px 12px", fontSize: "14px", fontWeight: 500,
                    color: currentPage === page ? "white" : c.buttonText,
                    backgroundColor: currentPage === page ? c.buttonActive : c.buttonBg,
                    border: `1px solid ${c.buttonBorder}`, borderRadius: "6px",
                    cursor: "pointer", transition: "all 0.2s", minWidth: "40px",
                  }}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={onNextPage}
              disabled={!hasNextPage}
              style={{
                padding: "8px 16px", fontSize: "14px", fontWeight: 500,
                color: hasNextPage ? c.buttonActive : c.buttonDisabled,
                backgroundColor: c.buttonBg, border: `1px solid ${c.buttonBorder}`,
                borderRadius: "6px", cursor: hasNextPage ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    />
  );
};

export default FooterRendererDemo;
