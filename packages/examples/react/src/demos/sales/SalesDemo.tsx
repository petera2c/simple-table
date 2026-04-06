import { useState, useEffect } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, CellChangeProps } from "@simple-table/react";
import { salesSampleRows, type SalesRow } from "./sales.demo-data";
import { SALES_HEADERS } from "./sales-headers";
import "@simple-table/react/styles.css";

function formatTableHeight(height?: string | number | null): string {
  if (height == null) return "70dvh";
  if (typeof height === "number") return `${height}px`;
  return height;
}

const SalesDemo = ({ height, theme }: { height?: string | number | null; theme?: Theme }) => {
  const [data, setData] = useState<SalesRow[]>(() => salesSampleRows.map((r) => ({ ...r })));
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

  return (
    <SimpleTable
      autoExpandColumns={!isMobile}
      columnResizing
      columnReordering
      defaultHeaders={SALES_HEADERS}
      editColumns
      height={formatTableHeight(height)}
      initialSortColumn="dealValue"
      initialSortDirection="desc"
      onCellEdit={handleCellEdit}
      rows={data}
      selectableCells
      theme={theme}
    />
  );
};

export default SalesDemo;
