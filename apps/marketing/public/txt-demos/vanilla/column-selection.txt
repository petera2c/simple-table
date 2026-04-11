import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { columnSelectionConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderColumnSelectionDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: columnSelectionConfig.headers,
    rows: columnSelectionConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    selectableColumns: columnSelectionConfig.tableProps.selectableColumns,
  });
  return table;
}
