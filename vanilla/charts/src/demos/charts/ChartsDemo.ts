import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { chartsConfig } from "./charts.demo-data";
import "simple-table-core/styles.css";

export function renderChartsDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  return new SimpleTableVanilla(container, {
    columnReordering: chartsConfig.tableProps.columnReordering,
    columnResizing: chartsConfig.tableProps.columnResizing,
    defaultHeaders: chartsConfig.headers,
    rows: chartsConfig.rows,
    selectableCells: chartsConfig.tableProps.selectableCells,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });
}
