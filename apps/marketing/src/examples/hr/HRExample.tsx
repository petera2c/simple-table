import { SimpleTable } from "@simple-table/react";
import type { Theme, CellChangeProps, ReactIconsConfig } from "@simple-table/react";
import { HEADERS } from "./hr-headers";
import { useState, useEffect } from "react";
import "@simple-table/react/styles.css";
import { useHRData } from "./useHRData";

export default function HRExample({
  height = 500,
  icons,
  rowCount = 1000,
  rowHeight = 48,
  theme,
}: {
  height: number | null;
  icons?: ReactIconsConfig;
  rowCount?: number;
  rowHeight?: number;
  theme?: Theme;
}) {
  const { data: fetchedData, isLoading } = useHRData(rowCount);
  const [data, setData] = useState(fetchedData);

  // Update local data when fetched data changes
  useEffect(() => {
    setData(fetchedData);
  }, [fetchedData]);

  const howManyRowsCanFit = height ? Math.floor(height / rowHeight) : 10;

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
        Loading HR data...
      </div>
    );
  }

  return (
    <SimpleTable
      columnReordering
      columnResizing
      defaultHeaders={HEADERS}
      icons={icons}
      onCellEdit={handleCellEdit}
      customTheme={{
        rowHeight: rowHeight,
      }}
      rows={data}
      rowsPerPage={howManyRowsCanFit}
      selectableCells
      shouldPaginate
      theme={theme}
    />
  );
}
