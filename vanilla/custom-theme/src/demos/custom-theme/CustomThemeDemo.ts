import { SimpleTableVanilla } from "simple-table-core";
import type { ThemeContact } from "./custom-theme.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { customThemeConfig } from "./custom-theme.demo-data";
import "simple-table-core/styles.css";
import "./custom-theme.css";


const getRowId = ({ row }: GetRowIdParams<ThemeContact>) => row.id;
export function renderCustomThemeDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<ThemeContact> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: [...customThemeConfig.headers],
    rows: customThemeConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme ?? "custom",
    customTheme: customThemeConfig.tableProps.customTheme,
    columnResizing: true,
    selectableCells: true,
  });
  return table;
}
