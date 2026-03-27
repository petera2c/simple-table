import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, SortColumn } from "simple-table-core";
import { externalSortConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderExternalSortDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  let currentSort: SortColumn | null = null;

  function getSortedRows() {
    const rows = [...externalSortConfig.rows];
    if (!currentSort) return rows;
    const accessor = currentSort.key.accessor as string;
    const dir = currentSort.direction;
    return rows.sort((a, b) => {
      const aVal = a[accessor];
      const bVal = b[accessor];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return dir === "asc" ? cmp : -cmp;
    });
  }

  const table = new SimpleTableVanilla(container, {
    defaultHeaders: externalSortConfig.headers,
    rows: externalSortConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    externalSortHandling: true,
    columnResizing: true,
    onSortChange: (sort) => {
      currentSort = sort;
      table.update({ rows: getSortedRows() });
    },
  });
  return table;
}
