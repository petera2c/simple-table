import { SimpleTable } from "@simple-table/react";
import type { CellChangeProps, Theme, ReactIconsConfig } from "@simple-table/react";
import { applySalesColumnLabels, SALES_HEADERS, type SalesLocale } from "./sales-headers";
import { useState, useEffect, useMemo } from "react";
import "@simple-table/react/styles.css";
import { useSalesData } from "./useSalesData";

export default function SalesExample({
  height,
  icons,
  locale = "en",
  onTableReady,
  theme,
}: {
  height?: string | number | null;
  icons?: ReactIconsConfig;
  locale?: SalesLocale;
  onTableReady?: () => void;
  theme?: Theme;
}) {
  const { data: fetchedData, isLoading } = useSalesData();
  const [data, setData] = useState(fetchedData);
  const [isMobile, setIsMobile] = useState(false);
  const columns = useMemo(() => applySalesColumnLabels(SALES_HEADERS, locale), [locale]);

  // Update local data when fetched data changes
  useEffect(() => {
    setData(fetchedData);
  }, [fetchedData]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
    setData((prevData) =>
      prevData.map((item) => {
        if (item.id === row.id) {
          return {
            ...item,
            [accessor]: newValue,
          };
        }
        return item;
      }),
    );
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: height ? `${height}px` : "70dvh",
          fontSize: "16px",
          color: "#666",
        }}
      >
        Loading sales data...
      </div>
    );
  }

  return (
    <SimpleTable
      autoExpandColumns={!isMobile}
      columnResizing
      columnReordering
      columns={columns}
      enableColumnEditor
      height={height ? `${height}px` : "70dvh"}
      icons={icons}
      initialSortColumn="dealValue"
      initialSortDirection="desc"
      onCellEdit={handleCellEdit}
      onTableReady={onTableReady}
      rows={data}
      selectableCells
      theme={theme}
    />
  );
}
