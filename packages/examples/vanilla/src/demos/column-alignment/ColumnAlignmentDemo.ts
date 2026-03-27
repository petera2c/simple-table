import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { columnAlignmentConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderColumnAlignmentDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: columnAlignmentConfig.headers,
    rows: columnAlignmentConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });
  return table;
}
