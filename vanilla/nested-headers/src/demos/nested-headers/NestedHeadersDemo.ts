import { SimpleTableVanilla } from "simple-table-core";
import type { StudentScores } from "./nested-headers.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { nestedHeadersConfig } from "./nested-headers.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<StudentScores>) => row.id;
export function renderNestedHeadersDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<StudentScores> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: nestedHeadersConfig.headers,
    rows: nestedHeadersConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    columnResizing: nestedHeadersConfig.tableProps.columnResizing,
  });
  return table;
}
