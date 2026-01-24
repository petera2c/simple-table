import { useRef } from "react";

import { HEADERS } from "./music-headers";
import Theme from "../../../types/Theme";
import TableRefType from "../../../types/TableRefType";
import SimpleTable from "../../../components/simple-table/SimpleTable";

import data from "./music-data.json";

export const musicExampleDefaults = {
  columnResizing: true,
  height: "70dvh",
};

export default function MusicExample({
  height,
  theme,
  rowCount = 50,
}: {
  height?: string;
  theme?: Theme;
  rowCount?: number;
}) {
  const tableRef = useRef<TableRefType | null>(null);

  return (
    <SimpleTable
      columnReordering
      columnResizing
      defaultHeaders={HEADERS}
      height={height ? height : "70dvh"}
      customTheme={{
        rowHeight: 85,
        headerHeight: 40,
      }}
      rows={data}
      selectableCells
      tableRef={tableRef}
      theme={"frost"}
    />
  );
}
