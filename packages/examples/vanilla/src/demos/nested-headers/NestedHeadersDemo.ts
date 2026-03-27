import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { nestedHeadersConfig } from "@simple-table/examples-shared";
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
    columnResizing: true,
  });
  return table;
}
