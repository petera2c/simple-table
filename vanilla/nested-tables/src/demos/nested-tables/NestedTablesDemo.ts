import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { nestedTablesConfig, generateNestedTablesData } from "./nested-tables.demo-data";
import "simple-table-core/styles.css";

export function renderNestedTablesDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const sampleData = generateNestedTablesData(25);

  return new SimpleTableVanilla(container, {
    autoExpandColumns: nestedTablesConfig.tableProps.autoExpandColumns,
    defaultHeaders: nestedTablesConfig.headers,
    rows: sampleData,
    rowGrouping: nestedTablesConfig.tableProps.rowGrouping,
    getRowId: nestedTablesConfig.tableProps.getRowId,
    expandAll: nestedTablesConfig.tableProps.expandAll,
    columnResizing: nestedTablesConfig.tableProps.columnResizing,
    height: options?.height ?? "500px",
    theme: options?.theme,
  });
}
