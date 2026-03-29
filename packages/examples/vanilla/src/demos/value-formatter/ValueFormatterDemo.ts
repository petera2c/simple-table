import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { valueFormatterConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderValueFormatterDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: valueFormatterConfig.headers,
    rows: valueFormatterConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    selectableCells: valueFormatterConfig.tableProps.selectableCells,
  });
  return table;
}
