import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, TableFilterState } from "simple-table-core";
import { externalFilterConfig, matchesFilter } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderExternalFilterDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  let currentFilters: TableFilterState = {};

  const applyFilters = () => {
    const entries = Object.entries(currentFilters);
    if (entries.length === 0) {
      table.update({ rows: externalFilterConfig.rows });
      return;
    }
    const filtered = externalFilterConfig.rows.filter((row) =>
      entries.every(([accessor, filter]) =>
        matchesFilter(row[accessor as keyof typeof row] as any, filter)
      )
    );
    table.update({ rows: filtered });
  };

  const table = new SimpleTableVanilla(container, {
    defaultHeaders: externalFilterConfig.headers,
    rows: externalFilterConfig.rows,
    externalFilterHandling: true,
    columnResizing: true,
    height: options?.height ?? "400px",
    theme: options?.theme,
    onFilterChange: (newFilters: TableFilterState) => {
      currentFilters = newFilters;
      applyFilters();
    },
  });

  return table;
}
