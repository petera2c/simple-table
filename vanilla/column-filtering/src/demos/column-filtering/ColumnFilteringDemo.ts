import { SimpleTableVanilla } from "simple-table-core";
import type { ColumnFilteringEmployee } from "./column-filtering.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { columnFilteringConfig } from "./column-filtering.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<ColumnFilteringEmployee>) => row.id;
export function renderColumnFilteringDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<ColumnFilteringEmployee> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: columnFilteringConfig.headers,
    rows: columnFilteringConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });
  return table;
}
