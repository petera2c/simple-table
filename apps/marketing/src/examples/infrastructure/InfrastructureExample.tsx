import { useMemo, useRef } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactIconsConfig } from "@simple-table/react";
import type { TableAPI, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";
import { HEADERS, MOBILE_VISIBLE_ACCESSORS } from "./infrastructure-headers";
import { useServerMetricsUpdates } from "./useServerMetricsUpdates";
import { useInfrastructureData, type InfrastructureServer } from "./useInfrastructureData";
import { useMobileExampleColumns } from "../_shared/mobileColumns";

export default function InfrastructureExample({
  height,
  hideNameColumn = false,
  icons,
  theme,
}: {
  height?: string | number;
  /** Hide the "Name" (serverName) column — useful in tight hero layouts. */
  hideNameColumn?: boolean;
  icons?: ReactIconsConfig;
  theme?: Theme;
}) {
  const tableRef = useRef<TableAPI<InfrastructureServer> | null>(null);
  const { data, isLoading } = useInfrastructureData();

  // Use the hook for live metrics updates
  useServerMetricsUpdates(tableRef, data);

  const baseColumns = useMemo(
    () => (hideNameColumn ? HEADERS.filter((col) => col.accessor !== "serverName") : HEADERS),
    [hideNameColumn],
  );
  const columns = useMobileExampleColumns(baseColumns, MOBILE_VISIBLE_ACCESSORS);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: height ? height : "60dvh",
          fontSize: "16px",
          color: "#666",
        }}
      >
        Loading infrastructure data...
      </div>
    );
  }

  return (
    <SimpleTable
      autoExpandColumns
      columnReordering
      columnResizing
      columns={columns}
      enableColumnEditor
      getRowId={({ row }) => row.id}
      height={height ? height : "60dvh"}
      icons={icons}
      rows={data}
      selectableCells
      ref={tableRef}
      theme={theme}
    />
  );
}
