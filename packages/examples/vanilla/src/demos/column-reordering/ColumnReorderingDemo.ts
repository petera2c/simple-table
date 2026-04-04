import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { columnReorderingConfig } from "./column-reordering.demo-data";
import "simple-table-core/styles.css";

export function renderColumnReorderingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: columnReorderingConfig.headers,
    rows: columnReorderingConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    columnReordering: true,
  });
  return table;
}
