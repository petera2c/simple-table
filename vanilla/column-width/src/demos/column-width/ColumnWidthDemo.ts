import { SimpleTableVanilla } from "simple-table-core";
import type { StartupEmployee } from "./column-width.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { columnWidthConfig } from "./column-width.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<StartupEmployee>) => row.id;
export function renderColumnWidthDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla<StartupEmployee> {
  const isMobile = window.innerWidth < 768;

  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: columnWidthConfig.headers,
    rows: columnWidthConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    autoExpandColumns: !isMobile,
    columnResizing: true,
  });

  const check = () => {
    const mobile = window.innerWidth < 768;
    table.update({ autoExpandColumns: !mobile });
  };
  window.addEventListener("resize", check);

  return table;
}
