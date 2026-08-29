"use client";

import { useRef } from "react";
import { SimpleTable } from "@simple-table/react";
import type { TableAPI, Theme, ReactIconsConfig } from "@simple-table/react";
import { HEADERS, MOBILE_COLUMN_OPTIONS, MOBILE_VISIBLE_ACCESSORS } from "./music-headers";
import { useMobileExampleColumns } from "../_shared/mobileColumns";
import { useIsMobile } from "@/hooks/useIsMobile";

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
  const isMobile = useIsMobile();
  const columns = useMobileExampleColumns(HEADERS, MOBILE_VISIBLE_ACCESSORS, MOBILE_COLUMN_OPTIONS);

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
        autoExpandColumns
        columnReordering
        columnResizing={!isMobile}
        customTheme={{
          headerHeight: 30,
          rowHeight: isMobile ? 52 : 85,
        }}
        columns={columns}
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
