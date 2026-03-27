import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { themesConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderThemesDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: themesConfig.headers,
    rows: themesConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });
  return table;
}
