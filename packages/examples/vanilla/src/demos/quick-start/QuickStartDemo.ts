import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { quickStartConfig } from "./quick-start.demo-data";
import "simple-table-core/styles.css";

export function renderQuickStartDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: quickStartConfig.headers,
    rows: quickStartConfig.rows,
    height: options?.height ?? "300px",
    theme: options?.theme,
    editColumns: quickStartConfig.tableProps.editColumns,
    selectableCells: quickStartConfig.tableProps.selectableCells,
    customTheme: quickStartConfig.tableProps.customTheme,
  });
  return table;
}
