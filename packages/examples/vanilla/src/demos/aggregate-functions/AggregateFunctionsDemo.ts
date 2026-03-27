import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { aggregateFunctionsConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderAggregateFunctionsDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: aggregateFunctionsConfig.headers,
    rows: aggregateFunctionsConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });
  return table;
}
