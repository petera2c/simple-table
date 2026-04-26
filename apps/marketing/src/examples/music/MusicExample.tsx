import { useRef } from "react";
import { SimpleTable } from "@simple-table/react";
import type { TableAPI, Theme, ReactIconsConfig } from "@simple-table/react";
import { HEADERS } from "./music-headers";

import "@simple-table/react/styles.css";
import "./MusicTheme.css";
import { useMusicData } from "./useMusicData";

export default function MusicExample({
  height,
  icons,
  theme,
}: {
  height?: string | number;
  icons?: ReactIconsConfig;
  theme?: Theme;
}) {
  const tableRef = useRef<TableAPI | null>(null);
  const { data, isLoading } = useMusicData();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: height ? height : "70dvh",
          fontSize: "16px",
          color: "#666",
        }}
      >
        Loading music artist data...
      </div>
    );
  }

  return (
    <div className="music-theme-container" style={{ fontFamily: "Inter" }}>
      <SimpleTable
        columnReordering
        columnResizing
        customTheme={{
          headerHeight: 30,
          rowHeight: 85,
        }}
        defaultHeaders={HEADERS}
        height={height ? height : "70dvh"}
        icons={icons}
        rows={data}
        selectableCells
        ref={tableRef}
        theme={theme}
      />
    </div>
  );
}
