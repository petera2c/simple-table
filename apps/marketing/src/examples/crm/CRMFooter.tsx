import { useSyncExternalStore } from "react";
import type { FooterRendererProps } from "@simple-table/react";

const MOBILE_MQ = "(max-width: 740px)";

function getMobileMq(): MediaQueryList | null {
  if (typeof window === "undefined") return null;
  return window.matchMedia(MOBILE_MQ);
}

function subscribeMobile(cb: () => void) {
  const mq = getMobileMq();
  if (!mq) return () => {};
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getMobileSnapshot(): boolean {
  return getMobileMq()?.matches ?? false;
}

function useFooterIsMobile(): boolean {
  return useSyncExternalStore(subscribeMobile, getMobileSnapshot, () => false);
}

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
  const isMobile = useFooterIsMobile();

  const generateVisiblePages = (currentPage: number, totalPages: number): number[] => {
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfLeft = Math.floor((maxVisible - 1) / 2);
    const halfRight = Math.ceil((maxVisible - 1) / 2);
    let start = currentPage - halfLeft;
    let end = currentPage + halfRight;

    if (start < 1) {
      start = 1;
      end = Math.min(maxVisible, totalPages);
    }

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, totalPages - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = isMobile ? [] : generateVisiblePages(currentPage, totalPages);

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

  const summaryFontSize = isMobile ? "12px" : "14px";
  const controlFontSize = isMobile ? "12px" : "14px";
  const pageBtnPadding = isMobile ? "6px 10px" : "8px 16px";
  const arrowPadding = isMobile ? "6px" : "8px";

  const selectStyle = {
    border: `1px solid ${colors.inputBorder}`,
    borderRadius: "6px",
    padding: isMobile ? "2px 6px" : "4px 8px",
    fontSize: controlFontSize,
    backgroundColor: colors.inputBg,
    color: colors.text,
    cursor: "pointer" as const,
    maxWidth: isMobile ? "4.5rem" : undefined,
  };

  return (
    <div
      className="crm-footer"
      style={{
        borderTop: `1px solid ${colors.border}`,
        backgroundColor: colors.bg,
      }}
    >
      <p
        className="crm-footer__summary"
        style={{ fontSize: summaryFontSize, color: colors.text, margin: 0, whiteSpace: "nowrap" }}
      >
        {isMobile ? (
          <>
            <span style={{ fontWeight: 500 }}>{startRow}</span>–
            <span style={{ fontWeight: 500 }}>{endRow}</span>
            {" / "}
            <span style={{ fontWeight: 500 }}>{totalRows}</span>
          </>
        ) : (
          <>
            Showing <span style={{ fontWeight: "500" }}>{startRow}</span> to{" "}
            <span style={{ fontWeight: "500" }}>{endRow}</span> of{" "}
            <span style={{ fontWeight: "500" }}>{totalRows}</span> results
          </>
        )}
      </p>

      <div className="crm-footer__toolbar">
        <div
          className="crm-footer__page-size"
          style={{ display: "flex", alignItems: "center", gap: isMobile ? 0 : "8px" }}
        >
          {!isMobile && (
            <label htmlFor="itemsPerPage" style={{ fontSize: "14px", color: colors.text }}>
              Show:
            </label>
          )}
          <select
            id="itemsPerPage"
            aria-label={isMobile ? "Rows per page" : undefined}
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              onPageChange(1);
            }}
            style={selectStyle}
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="10000">all</option>
          </select>
          {!isMobile && <span style={{ fontSize: "14px", color: colors.text }}>per page</span>}
        </div>

        <nav
          className="crm-footer__pagination"
          style={{
            display: "inline-flex",
            borderRadius: "6px",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            flexShrink: 0,
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={onPrevPage}
            disabled={!hasPrevPage}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: arrowPadding,
              borderTopLeftRadius: "6px",
              borderBottomLeftRadius: "6px",
              border: `1px solid ${colors.buttonBorder}`,
              backgroundColor: colors.buttonBg,
              fontSize: controlFontSize,
              fontWeight: "500",
              color: colors.buttonText,
              cursor: hasPrevPage ? "pointer" : "not-allowed",
              opacity: hasPrevPage ? 1 : 0.5,
            }}
          >
            ‹
          </button>

          {isMobile ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: pageBtnPadding,
                border: `1px solid ${colors.buttonBorder}`,
                backgroundColor: colors.activeBg,
                fontSize: controlFontSize,
                fontWeight: 600,
                color: colors.activeText,
                marginLeft: "-1px",
                minWidth: "2.75rem",
              }}
            >
              {currentPage}/{Math.max(totalPages, 1)}
            </span>
          ) : (
            visiblePages.map((page) => (
              <button
                type="button"
                key={page}
                onClick={() => onPageChange(page)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: pageBtnPadding,
                  border: `1px solid ${colors.buttonBorder}`,
                  backgroundColor: currentPage === page ? colors.activeBg : colors.buttonBg,
                  fontSize: controlFontSize,
                  fontWeight: "500",
                  color: currentPage === page ? colors.activeText : colors.text,
                  cursor: "pointer",
                  marginLeft: "-1px",
                }}
              >
                {page}
              </button>
            ))
          )}

          <button
            type="button"
            onClick={onNextPage}
            disabled={!hasNextPage}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: arrowPadding,
              borderTopRightRadius: "6px",
              borderBottomRightRadius: "6px",
              border: `1px solid ${colors.buttonBorder}`,
              backgroundColor: colors.buttonBg,
              fontSize: controlFontSize,
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
