import { SimpleTableVanilla } from "simple-table-core";
import type { CellHighlightingEmployee } from "./cell-highlighting.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { cellHighlightingConfig } from "./cell-highlighting.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<CellHighlightingEmployee>) => row.id;
export function renderCellHighlightingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<CellHighlightingEmployee> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: cellHighlightingConfig.headers,
    rows: cellHighlightingConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    selectableCells: cellHighlightingConfig.tableProps.selectableCells,
    selectableColumns: cellHighlightingConfig.tableProps.selectableColumns,
  });
  return table;
}
