import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { columnWidthConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderColumnWidthDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla {
  const isMobile = window.innerWidth < 768;

  const table = new SimpleTableVanilla(container, {
    defaultHeaders: columnWidthConfig.headers,
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
