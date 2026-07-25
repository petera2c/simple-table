import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { soccerConfig } from "./soccer.demo-data";
import "simple-table-core/styles.css";

export function renderSoccerDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  return new SimpleTableVanilla(container, {
    columns: soccerConfig.headers,
    rows: soccerConfig.rows,
    height: options?.height ?? "70dvh",
    theme: options?.theme,
    columnReordering: true,
    columnResizing: true,
    enableColumnEditor: true,
    selectableCells: true,
    initialSortColumn: "rating",
    initialSortDirection: "desc",
    customTheme: { headerHeight: 40, rowHeight: 48 },
  });
}
