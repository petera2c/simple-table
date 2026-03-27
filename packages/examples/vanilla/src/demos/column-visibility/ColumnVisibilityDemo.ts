import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { columnVisibilityConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderColumnVisibilityDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: [...columnVisibilityConfig.headers],
    rows: columnVisibilityConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    editColumns: columnVisibilityConfig.tableProps.editColumns,
  });
  return table;
}
