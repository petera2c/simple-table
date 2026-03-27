<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import type { TableFilterState } from "simple-table-core";
  import { externalFilterConfig, matchesFilter } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let filters = $state<TableFilterState>({});

  let filteredRows = $derived.by(() => {
    const entries = Object.entries(filters);
    if (entries.length === 0) return externalFilterConfig.rows;

    return externalFilterConfig.rows.filter((row) =>
      entries.every(([accessor, filter]) =>
        matchesFilter(row[accessor as keyof typeof row] as any, filter)
      )
    );
  });

  function handleFilterChange(newFilters: TableFilterState) {
    filters = newFilters;
  }
</script>

<SimpleTable
  defaultHeaders={externalFilterConfig.headers}
  rows={filteredRows}
  externalFilterHandling={true}
  columnResizing={true}
  onFilterChange={handleFilterChange}
  {height}
  {theme}
/>
