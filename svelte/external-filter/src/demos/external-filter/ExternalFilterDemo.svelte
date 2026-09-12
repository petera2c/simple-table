<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, TableFilterState, GetRowIdParams } from "@simple-table/svelte";
  import { externalFilterConfig, matchesFilter } from "./external-filter.demo-data";
  import type { FilterableEmployee } from "./external-filter.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let filters = $state<TableFilterState<FilterableEmployee>>({});

  const getRowId = ({ row }: GetRowIdParams<FilterableEmployee>) => row.id;

  let filteredRows = $derived.by(() => {
    const entries = Object.entries(filters);
    if (entries.length === 0) return externalFilterConfig.rows;

    return externalFilterConfig.rows.filter((row) =>
      entries.every(([accessor, filter]) =>
        matchesFilter(row[accessor as keyof FilterableEmployee], filter),
      ),
    );
  });

  function handleFilterChange(newFilters: TableFilterState<FilterableEmployee>) {
    filters = newFilters;
  }
</script>

<SimpleTable
  columns={externalFilterConfig.headers}
  rows={filteredRows}
  {getRowId}
  externalFilterHandling={true}
  columnResizing={true}
  onFilterChange={handleFilterChange}
  {height}
  {theme}
/>
