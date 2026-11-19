import { SimpleTableVanilla } from "simple-table-core";
import type { ColumnAlignmentPlayer } from "./column-alignment.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { columnAlignmentConfig } from "./column-alignment.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<ColumnAlignmentPlayer>) => row.id;
export function renderColumnAlignmentDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<ColumnAlignmentPlayer> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: columnAlignmentConfig.headers,
    rows: columnAlignmentConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });
  return table;
}
