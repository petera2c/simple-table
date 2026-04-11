import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { singleRowChildrenConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderSingleRowChildrenDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  return new SimpleTableVanilla(container, {
    defaultHeaders: singleRowChildrenConfig.headers,
    rows: singleRowChildrenConfig.rows,
    columnResizing: singleRowChildrenConfig.tableProps.columnResizing,
    selectableCells: singleRowChildrenConfig.tableProps.selectableCells,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });
}
