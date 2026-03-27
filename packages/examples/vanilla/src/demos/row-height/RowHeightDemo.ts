import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { rowHeightConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderRowHeightDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: rowHeightConfig.headers,
    rows: rowHeightConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    customTheme: rowHeightConfig.tableProps.customTheme,
  });
  return table;
}
