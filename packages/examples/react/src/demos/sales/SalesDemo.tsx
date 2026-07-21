import { useMemo, useState, useEffect } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, CellChangeProps, FooterRendererProps } from "@simple-table/react";
import { generateSalesData, type SalesRow } from "./sales.demo-data";
import { SALES_HEADERS } from "./sales-headers";
import "@simple-table/react/styles.css";

function formatTableHeight(height?: string | number | null): string {
  if (height == null) return "70dvh";
  if (typeof height === "number") return `${height}px`;
  return height;
}

function getFooterColors(theme?: Theme) {
  switch (theme) {
    case "modern-dark":
    case "dark":
      return {
        background: "#111827",
        border: "#374151",
        text: "#d1d5db",
        buttonBg: "#1f2937",
        buttonBorder: "#374151",
        buttonActive: "#3b82f6",
        buttonDisabled: "#6b7280",
      };
    default:
      return {
        background: "#f8fafc",
        border: "#e2e8f0",
        text: "#475569",
        buttonBg: "white",
        buttonBorder: "#e2e8f0",
        buttonActive: "#3b82f6",
        buttonDisabled: "#cbd5e1",
      };
  }
}

const SalesDemo = ({ height, theme }: { height?: string | number | null; theme?: Theme }) => {
  const [data, setData] = useState<SalesRow[]>(() => generateSalesData(240));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, [accessor]: newValue } : item)),
    );
  };

  const colors = useMemo(() => getFooterColors(theme), [theme]);

  const renderFooter = ({
    currentPage,
    startRow,
    endRow,
    totalRows,
    totalPages,
    hasPrevPage,
    hasNextPage,
    onPrevPage,
    onNextPage,
  }: FooterRendererProps) => {
    const btnStyle = (disabled: boolean): React.CSSProperties => ({
      padding: "6px 14px",
      fontSize: "14px",
      fontWeight: 500,
      color: disabled ? colors.buttonDisabled : colors.buttonActive,
      backgroundColor: colors.buttonBg,
      border: `1px solid ${colors.buttonBorder}`,
      borderRadius: "6px",
      cursor: disabled ? "not-allowed" : "pointer",
    });

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.border}`,
          color: colors.text,
          fontSize: "14px",
        }}
      >
        <span style={{ fontWeight: 600 }}>
          Showing {startRow}–{endRow} of {totalRows} deals
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={onPrevPage} disabled={!hasPrevPage} style={btnStyle(!hasPrevPage)}>
            Previous
          </button>
          <span style={{ minWidth: "90px", textAlign: "center" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={onNextPage} disabled={!hasNextPage} style={btnStyle(!hasNextPage)}>
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <SimpleTable
      autoExpandColumns={!isMobile}
      columnResizing
      columnReordering
      columns={SALES_HEADERS}
      enableColumnEditor
      footerPosition="top"
      footerRenderer={renderFooter}
      height={formatTableHeight(height)}
      initialSortColumn="dealValue"
      initialSortDirection="desc"
      onCellEdit={handleCellEdit}
      rows={data}
      rowsPerPage={40}
      selectableCells
      enablePagination
      theme={theme}
    />
  );
};

export default SalesDemo;
