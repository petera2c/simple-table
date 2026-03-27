import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { customThemeConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderCustomThemeDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: [...customThemeConfig.headers],
    rows: customThemeConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme ?? customThemeConfig.tableProps.theme,
    customTheme: customThemeConfig.tableProps.customTheme,
  });
  return table;
}
