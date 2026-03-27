<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { programmaticControlConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let tableRef: any;

  function handleSort() {
    tableRef?.getAPI()?.applySortState({ accessor: "name", direction: "asc" });
  }

  function handleFilter() {
    tableRef?.getAPI()?.applyFilter({
      accessor: "salary",
      operator: "greaterThan",
      value: 100000,
    });
  }

  function handleClearFilters() {
    tableRef?.getAPI()?.clearAllFilters();
  }

  function handleInfo() {
    const api = tableRef?.getAPI();
    if (!api) return;
    const sort = api.getSortState();
    const filters = api.getFilterState();
    const sortInfo = sort ? `${sort.key.accessor} (${sort.direction})` : "none";
    const filterCount = Object.keys(filters).length;
    alert(`Sort: ${sortInfo}\nActive filters: ${filterCount}`);
  }
</script>

<div>
  <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
    <button onclick={handleSort}>Sort by Name (asc)</button>
    <button onclick={handleFilter}>Filter: Salary &gt; 100k</button>
    <button onclick={handleClearFilters}>Clear Filters</button>
    <button onclick={handleInfo}>Sort/Filter Info</button>
  </div>
  <SimpleTable
    bind:this={tableRef}
    defaultHeaders={programmaticControlConfig.headers}
    rows={programmaticControlConfig.rows}
    columnResizing={programmaticControlConfig.tableProps.columnResizing}
    {height}
    {theme}
  />
</div>
