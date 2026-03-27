import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { columnFilteringConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderColumnFilteringDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: columnFilteringConfig.headers,
    rows: columnFilteringConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });
  return table;
}
