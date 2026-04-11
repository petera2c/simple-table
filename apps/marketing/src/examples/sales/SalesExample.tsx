import { SimpleTable } from "@simple-table/react";
import type { CellChangeProps, Theme, ReactIconsConfig } from "@simple-table/react";
import { SALES_HEADERS } from "./sales-headers";
import { useState, useEffect } from "react";
import "@simple-table/react/styles.css";
import { useSalesData } from "./useSalesData";

export default function SalesExample({
  height,
  icons,
  onGridReady,
  rowCount = 1000,
  theme,
}: {
  height?: string | number | null;
  icons?: ReactIconsConfig;
  onGridReady?: () => void;
  rowCount?: number;
  theme?: Theme;
}) {
  const { data: fetchedData, isLoading } = useSalesData(rowCount);
  const [data, setData] = useState(fetchedData);
  const [isMobile, setIsMobile] = useState(false);

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
      defaultHeaders={SALES_HEADERS}
      editColumns
      height={height ? `${height}px` : "70dvh"}
      icons={icons}
      initialSortColumn="dealValue"
      initialSortDirection="desc"
      onCellEdit={handleCellEdit}
      onGridReady={onGridReady}
      rows={data}
      selectableCells
      theme={theme}
    />
  );
}
