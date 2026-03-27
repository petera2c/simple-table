import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, Row } from "simple-table-core";
import { infiniteScrollConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderInfiniteScrollDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  let currentRows: Row[] = [...infiniteScrollConfig.rows];

  const table = new SimpleTableVanilla(container, {
    defaultHeaders: infiniteScrollConfig.headers,
    rows: currentRows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    onLoadMore: () => {
      const nextId = currentRows.length + 1;
      const newRows: Row[] = Array.from({ length: 20 }, (_, i) => ({
        id: nextId + i,
      }));
      currentRows = [...currentRows, ...newRows];
      table.update({ rows: currentRows });
    },
  });
  return table;
}
