import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { paginationConfig, paginationData, PAGINATION_ROWS_PER_PAGE } from "./pagination.demo-data";
import "simple-table-core/styles.css";

export function renderPaginationDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  let rows = paginationData.slice(0, PAGINATION_ROWS_PER_PAGE);

  const table = new SimpleTableVanilla(container, {
    defaultHeaders: paginationConfig.headers,
    rows,
    height: options?.height ?? "auto",
    theme: options?.theme,
    shouldPaginate: true,
    rowsPerPage: PAGINATION_ROWS_PER_PAGE,
    onNextPage: async (pageIndex: number) => {
      const startIndex = pageIndex * PAGINATION_ROWS_PER_PAGE;
      const endIndex = startIndex + PAGINATION_ROWS_PER_PAGE;

      table.update({ isLoading: true });
      await new Promise((resolve) => setTimeout(resolve, 800));
      const newPageData = paginationData.slice(startIndex, endIndex);

      if (newPageData.length === 0 || rows.length > startIndex) {
        table.update({ isLoading: false });
        return false;
      }

      rows = [...rows, ...newPageData];
      table.update({ rows, isLoading: false });
      return true;
    },
  });

  return table;
}
