import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { collapsibleColumnsConfig } from "./collapsible-columns.demo-data";
import "simple-table-core/styles.css";

export function renderCollapsibleColumnsDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: collapsibleColumnsConfig.headers,
    rows: collapsibleColumnsConfig.rows,
    columnResizing: true,
    editColumns: true,
    selectableCells: true,
    columnReordering: true,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });
  return table;
}
