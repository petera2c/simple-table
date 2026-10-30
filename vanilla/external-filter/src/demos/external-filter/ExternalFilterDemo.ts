import { SimpleTableVanilla } from "simple-table-core";
import type { FilterableEmployee } from "./external-filter.demo-data";
import type { Theme, TableFilterState, GetRowIdParams } from "simple-table-core";
import { externalFilterConfig, matchesFilter } from "./external-filter.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<FilterableEmployee>) => row.id;

type FilterableKey = keyof FilterableEmployee;

function isFilterableKey(accessor: string): accessor is FilterableKey {
  return (
    accessor === "id" ||
    accessor === "name" ||
    accessor === "age" ||
    accessor === "email" ||
    accessor === "salary" ||
    accessor === "department" ||
    accessor === "active" ||
    accessor === "location"
  );
}

export function renderExternalFilterDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<FilterableEmployee> {
  let currentFilters: TableFilterState<FilterableEmployee> = {};

  const applyFilters = () => {
    const entries = Object.entries(currentFilters);
    if (entries.length === 0) {
      table.update({ rows: externalFilterConfig.rows });
      return;
    }
    const filtered = externalFilterConfig.rows.filter((row) =>
      entries.every(([accessor, filter]) =>
        isFilterableKey(accessor) ? matchesFilter(row[accessor], filter) : true
      )
    );
    table.update({ rows: filtered });
  };

  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: externalFilterConfig.headers,
    rows: externalFilterConfig.rows,
    externalFilterHandling: true,
    columnResizing: true,
    height: options?.height ?? "400px",
    theme: options?.theme,
    onFilterChange: (newFilters: TableFilterState<FilterableEmployee>) => {
      currentFilters = newFilters;
      applyFilters();
    },
  });

  return table;
}
