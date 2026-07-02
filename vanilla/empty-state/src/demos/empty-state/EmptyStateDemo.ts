import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { emptyStateConfig, buildEmptyStateElement } from "./empty-state.demo-data";
import "simple-table-core/styles.css";

export function renderEmptyStateDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: [...emptyStateConfig.headers],
    rows: emptyStateConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    tableEmptyStateRenderer: buildEmptyStateElement(),
  });
  return table;
}
