import { SimpleTableVanilla } from "simple-table-core";
import type { ColumnPinningEmployee } from "./column-pinning.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { columnPinningConfig } from "./column-pinning.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<ColumnPinningEmployee>) => row.id;
export function renderColumnPinningDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla<ColumnPinningEmployee> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: columnPinningConfig.headers,
    rows: columnPinningConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    columnResizing: columnPinningConfig.tableProps.columnResizing,
  });
  return table;
}
