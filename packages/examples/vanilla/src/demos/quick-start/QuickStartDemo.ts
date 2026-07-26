import { SimpleTableVanilla } from "simple-table-core";
import type { QuickStartEmployee } from "./quick-start.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { quickStartConfig } from "./quick-start.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<QuickStartEmployee>) => row.id;
export function renderQuickStartDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<QuickStartEmployee> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: quickStartConfig.headers,
    rows: quickStartConfig.rows,
    height: options?.height ?? "300px",
    theme: options?.theme,
    enableColumnEditor: quickStartConfig.tableProps.enableColumnEditor,
    selectableCells: quickStartConfig.tableProps.selectableCells,
    customTheme: quickStartConfig.tableProps.customTheme,
  });
  return table;
}
