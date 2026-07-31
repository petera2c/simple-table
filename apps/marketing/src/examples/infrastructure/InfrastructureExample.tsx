import { useRef, useState, useEffect } from "react";
import { SimpleTable } from "@simple-table/react";
import type { ReactIconsConfig } from "@simple-table/react";
import type { TableAPI, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";
import { HEADERS } from "./infrastructure-headers";
import { useServerMetricsUpdates } from "./useServerMetricsUpdates";
import { useInfrastructureData, type InfrastructureServer } from "./useInfrastructureData";

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
  const [isMobile, setIsMobile] = useState(false);

  // Use the hook for live metrics updates
  useServerMetricsUpdates(tableRef, data);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const columns = hideNameColumn
    ? HEADERS.filter((col) => col.accessor !== "serverName")
    : HEADERS;

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
      autoExpandColumns={!isMobile}
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
