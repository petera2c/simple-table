import { SimpleTableVanilla } from "simple-table-core";
import type { SortableEmployee } from "./external-sort.demo-data";
import type { Theme, SortColumn, GetRowIdParams, ColumnType } from "simple-table-core";
import { externalSortConfig } from "./external-sort.demo-data";
import "simple-table-core/styles.css";

const getRowId = ({ row }: GetRowIdParams<SortableEmployee>) => row.id;

type SortableKey = keyof SortableEmployee;

function isSortableKey(accessor: string): accessor is SortableKey {
  return (
    accessor === "id" ||
    accessor === "name" ||
    accessor === "age" ||
    accessor === "email" ||
    accessor === "salary" ||
    accessor === "department"
  );
}

type ActiveSort = {
  accessor: SortableKey;
  direction: "asc" | "desc";
  type?: ColumnType;
};

export function renderExternalSortDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla<SortableEmployee> {
  let currentSort: ActiveSort | null = null;

  function getSortedRows(): SortableEmployee[] {
    const rows = [...externalSortConfig.rows];
    if (!currentSort) return rows;
    const { accessor, type, direction } = currentSort;
    return rows.sort((a, b) => {
      const aVal = a[accessor];
      const bVal = b[accessor];
      if (aVal === bVal) return 0;
      const cmp =
        type === "number"
          ? (Number(aVal) || 0) - (Number(bVal) || 0)
          : String(aVal).localeCompare(String(bVal));
      return direction === "asc" ? cmp : -cmp;
    });
  }

  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: externalSortConfig.headers,
    rows: externalSortConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    externalSortHandling: true,
    columnResizing: true,
    onSortChange: (sort: SortColumn | null) => {
      if (!sort || !isSortableKey(sort.key.accessor)) {
        currentSort = null;
      } else {
        currentSort = {
          accessor: sort.key.accessor,
          direction: sort.direction,
          type: sort.key.type,
        };
      }
      table.update({ rows: getSortedRows() });
    },
  });
  return table;
}
