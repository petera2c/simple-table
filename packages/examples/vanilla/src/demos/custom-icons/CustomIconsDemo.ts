import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { customIconsConfig, buildVanillaCustomIcons } from "./custom-icons.demo-data";
import "simple-table-core/styles.css";

export function renderCustomIconsDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: [...customIconsConfig.headers],
    rows: customIconsConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    icons: buildVanillaCustomIcons(),
  });
  return table;
}
