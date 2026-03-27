import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { quickFilterConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderQuickFilterDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: quickFilterConfig.headers,
    rows: quickFilterConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    quickFilter: quickFilterConfig.tableProps.quickFilter,
  });
  return table;
}
