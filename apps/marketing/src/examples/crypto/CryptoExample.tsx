import { useRef } from "react";
import { SimpleTable } from "@simple-table/react";
import type { TableAPI, Theme, ReactIconsConfig } from "@simple-table/react";
import "@simple-table/react/styles.css";
import { HEADERS } from "./crypto-headers";
import { useCryptoData } from "./useCryptoData";
import { useCryptoTicker } from "./useCryptoTicker";

export default function CryptoExample({
  icons,
  theme,
}: {
  height?: string | number;
  icons?: ReactIconsConfig;
  theme?: Theme;
}) {
  const tableRef = useRef<TableAPI | null>(null);
  const { data } = useCryptoData();

  // Live "market feed" - ticks visible rows so prices, 24h change, and the
  // sparkline update in place with the built-in cell-flash animation.
  useCryptoTicker(tableRef, data);

  // External / page-level scroll: the table has no `height`, so it grows to its
  // natural size and the page scroller (`#main-scroll-container`) drives row
  // virtualization. The header auto-pins to the top of that scroller via CSS
  // sticky (the examples card uses overflow-visible so it escapes up to it).
  // Horizontal overflow is handled by the table's own internal section scroll.
  return (
    <SimpleTable
      columnReordering
      columnResizing
      customTheme={{ headerHeight: 40, rowHeight: 64 }}
      defaultHeaders={HEADERS}
      editColumns
      icons={icons}
      rows={data}
      selectableCells
      ref={tableRef}
      scrollParent={() =>
        typeof document !== "undefined"
          ? document.getElementById("main-scroll-container")
          : null
      }
      theme={theme}
    />
  );
}
