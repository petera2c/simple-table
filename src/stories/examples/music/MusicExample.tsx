import { useEffect, useRef, useState } from "react";

import { HEADERS } from "./music-headers";
import Theme from "../../../types/Theme";
import TableRefType from "../../../types/TableRefType";
import Row from "../../../types/Row";
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
      rowHeight={100}
      rowIdAccessor="id"
      rows={data}
      selectableCells
      tableRef={tableRef}
      theme={theme}
    />
  );
}
