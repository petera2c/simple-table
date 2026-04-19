import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { nestedHeadersConfig } from "./nested-headers.demo-data";
import "simple-table-core/styles.css";

export function renderNestedHeadersDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: nestedHeadersConfig.headers,
    rows: nestedHeadersConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    columnResizing: nestedHeadersConfig.tableProps.columnResizing,
  });
  return table;
}
