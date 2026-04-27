import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactIconsConfig } from "@simple-table/react";
import { HEADERS } from "./manufacturing-headers";
import "@simple-table/react/styles.css";
import { useManufacturingData } from "./useManufacturingData";

export default function ManufacturingExample({
  height,
  icons,
  theme,
}: {
  height: number | null;
  icons?: ReactIconsConfig;
  theme?: Theme;
}) {
  const { data, isLoading } = useManufacturingData();

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
        Loading manufacturing data...
      </div>
    );
  }

  return (
    <SimpleTable
      columnResizing
      columnReordering
      defaultHeaders={HEADERS}
      getRowId={({ row }) => String(row.id)}
      height={height ? `${height}px` : "70dvh"}
      icons={icons}
      rowGrouping={["stations"]}
      rows={data}
      selectableCells
      theme={theme}
    />
  );
}
