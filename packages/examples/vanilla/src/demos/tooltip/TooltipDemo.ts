import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { tooltipConfig } from "./tooltip.demo-data";
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
    columnResizing: tooltipConfig.tableProps.columnResizing,
    columnReordering: tooltipConfig.tableProps.columnReordering,
    selectableCells: tooltipConfig.tableProps.selectableCells,
  });
  return table;
}
