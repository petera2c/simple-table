import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { tooltipConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderTooltipDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: [...tooltipConfig.headers],
    rows: tooltipConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    selectableCells: tooltipConfig.tableProps.selectableCells,
  });
  return table;
}
