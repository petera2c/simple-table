import { SimpleTableVanilla } from "simple-table-core";
import type { ArchitectStaff } from "./row-height.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { rowHeightConfig } from "./row-height.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<ArchitectStaff>) => row.id;
export function renderRowHeightDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<ArchitectStaff> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: rowHeightConfig.headers,
    rows: rowHeightConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    customTheme: rowHeightConfig.tableProps.customTheme,
  });
  return table;
}
