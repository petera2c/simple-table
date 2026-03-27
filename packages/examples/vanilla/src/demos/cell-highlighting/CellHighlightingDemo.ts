import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { cellHighlightingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderCellHighlightingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: cellHighlightingConfig.headers,
    rows: cellHighlightingConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    selectableCells: true,
    selectableColumns: true,
  });
  return table;
}
