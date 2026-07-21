import { useRef } from "react";
import { SimpleTable } from "@simple-table/react";
import type { TableAPI, Theme, ReactIconsConfig } from "@simple-table/react";
import "@simple-table/react/styles.css";
import { HEADERS } from "./soccer-headers";
import { useSoccerData } from "./useSoccerData";

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

  return (
    <SimpleTable
      columnReordering
      columnResizing
      customTheme={{ headerHeight: 40, rowHeight: 60 }}
      columns={HEADERS}
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
