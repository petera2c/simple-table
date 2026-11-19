import { SimpleTableVanilla } from "simple-table-core";
import type { NestedCompany } from "./nested-tables.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { nestedTablesConfig, generateNestedTablesData } from "./nested-tables.demo-data";
import "simple-table-core/styles.css";

const getRowId = ({ row }: GetRowIdParams<NestedCompany>) => row.id;

export function renderNestedTablesDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<NestedCompany> {
  const sampleData = generateNestedTablesData(25);

  return new SimpleTableVanilla(container, {
    autoExpandColumns: nestedTablesConfig.tableProps.autoExpandColumns,
    columns: nestedTablesConfig.headers,
    rows: sampleData,
    rowGrouping: nestedTablesConfig.tableProps.rowGrouping,
    getRowId,
    expandAll: nestedTablesConfig.tableProps.expandAll,
    columnResizing: nestedTablesConfig.tableProps.columnResizing,
    height: options?.height ?? "500px",
    theme: options?.theme,
  });
}
