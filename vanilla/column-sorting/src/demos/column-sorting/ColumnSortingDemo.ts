import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { columnSortingConfig } from "./column-sorting.demo-data";
import "simple-table-core/styles.css";

export function renderColumnSortingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: columnSortingConfig.headers,
    rows: columnSortingConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    initialSortColumn: columnSortingConfig.tableProps.initialSortColumn,
    initialSortDirection: columnSortingConfig.tableProps.initialSortDirection,
  });
  return table;
}
