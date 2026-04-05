import { SimpleTableVanilla, asRows } from "simple-table-core";
import type { Theme, SortColumn, Row } from "simple-table-core";
import { externalSortConfig } from "./external-sort.demo-data";
import "simple-table-core/styles.css";

export function renderExternalSortDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  let currentSort: SortColumn | null = null;

  function getSortedRows(): Row[] {
    const rows = [...asRows(externalSortConfig.rows)];
    if (!currentSort) return rows;
    const accessor = currentSort.key.accessor as string;
    const type = currentSort.key.type;
    const dir = currentSort.direction;
    return rows.sort((a, b) => {
      const aVal = a[accessor];
      const bVal = b[accessor];
      if (aVal === bVal) return 0;
      const cmp =
        type === "number"
          ? (Number(aVal) || 0) - (Number(bVal) || 0)
          : String(aVal).localeCompare(String(bVal));
      return dir === "asc" ? cmp : -cmp;
    });
  }

  const table = new SimpleTableVanilla(container, {
    defaultHeaders: externalSortConfig.headers,
    rows: asRows(externalSortConfig.rows),
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
