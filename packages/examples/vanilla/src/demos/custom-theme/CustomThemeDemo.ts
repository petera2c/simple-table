import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { customThemeConfig } from "./custom-theme.demo-data";
import "simple-table-core/styles.css";
import "./custom-theme.css";

export function renderCustomThemeDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: [...customThemeConfig.headers],
    rows: customThemeConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme ?? "custom",
    customTheme: customThemeConfig.tableProps.customTheme,
    columnResizing: true,
    selectableCells: true,
  });
  return table;
}
