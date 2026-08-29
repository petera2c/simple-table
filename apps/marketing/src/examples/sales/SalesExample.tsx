import { SimpleTable } from "@simple-table/react";
import type { CellChangeProps, Theme, ReactIconsConfig } from "@simple-table/react";
import {
  applySalesColumnLabels,
  MOBILE_VISIBLE_ACCESSORS,
  SALES_HEADERS,
  type SalesLocale,
} from "./sales-headers";
import { useState, useEffect, useMemo } from "react";
import "@simple-table/react/styles.css";
import { useSalesData } from "./useSalesData";
import { useMobileExampleColumns } from "../_shared/mobileColumns";

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
  const labeledColumns = useMemo(
    () => applySalesColumnLabels(SALES_HEADERS, locale),
    [locale],
  );
  const columns = useMobileExampleColumns(labeledColumns, MOBILE_VISIBLE_ACCESSORS);

  // Update local data when fetched data changes
  useEffect(() => {
    setData(fetchedData);
  }, [fetchedData]);

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
      autoExpandColumns
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
