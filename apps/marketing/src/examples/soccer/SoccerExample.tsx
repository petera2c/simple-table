"use client";

import { useRef } from "react";
import { SimpleTable } from "@simple-table/react";
import type { TableAPI, Theme, ReactIconsConfig } from "@simple-table/react";
import "@simple-table/react/styles.css";
import { HEADERS, MOBILE_COLUMN_OPTIONS, MOBILE_VISIBLE_ACCESSORS } from "./soccer-headers";
import { useSoccerData } from "./useSoccerData";
import { useMobileExampleColumns } from "../_shared/mobileColumns";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function SoccerExample({
  height,
  icons,
  theme,
}: {
  height?: string | number;
  icons?: ReactIconsConfig;
  theme?: Theme;
}) {
  const tableRef = useRef<TableAPI | null>(null);
  const { data } = useSoccerData();
  const isMobile = useIsMobile();
  const columns = useMobileExampleColumns(HEADERS, MOBILE_VISIBLE_ACCESSORS, MOBILE_COLUMN_OPTIONS);

  return (
    <SimpleTable
      autoExpandColumns
      columnReordering
      columnResizing={!isMobile}
      customTheme={{ headerHeight: 40, rowHeight: isMobile ? 48 : 60 }}
      columns={columns}
      enableColumnEditor
      height={height ? height : "70dvh"}
      icons={icons}
      initialSortColumn="rating"
      initialSortDirection="desc"
      rows={data}
      selectableCells
      ref={tableRef}
      theme={theme}
    />
  );
}
