import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { aggregateFunctionsConfig } from "./aggregate-functions.demo-data";
import "simple-table-core/styles.css";

export function renderAggregateFunctionsDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: aggregateFunctionsConfig.headers,
    rows: aggregateFunctionsConfig.rows,
    rowGrouping: aggregateFunctionsConfig.tableProps.rowGrouping,
    columnResizing: true,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });
  return table;
}
