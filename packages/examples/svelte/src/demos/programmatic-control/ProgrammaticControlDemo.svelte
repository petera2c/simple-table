<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import type { HeaderObject } from "simple-table-core";
  import { programmaticControlConfig, PROGRAMMATIC_CONTROL_STATUS_COLORS } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let tableRef: any;
  let statusMessage = $state("No status message");

  const headers: HeaderObject[] = programmaticControlConfig.headers.map((h) => {
    if (h.accessor === "status") {
      return {
        ...h,
        cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
          const s = String(row.status);
          const colors = PROGRAMMATIC_CONTROL_STATUS_COLORS[s] ?? { bg: "#f3f4f6", color: "#374151" };
          return `<span style="background:${colors.bg};color:${colors.color};padding:4px 8px;border-radius:4px;font-size:12px;font-weight:bold">${s}</span>`;
        },
      };
    }
    return { ...h };
  });

  function handleSortByName() {
    tableRef?.getAPI()?.applySortState({ accessor: "name", direction: "asc" });
    statusMessage = "Sorted by Name (A-Z)";
  }

  function handleSortByPrice() {
    tableRef?.getAPI()?.applySortState({ accessor: "price", direction: "desc" });
    statusMessage = "Sorted by Price (High to Low)";
  }

  function handleFilterAvailable() {
    tableRef?.getAPI()?.applyFilter({ accessor: "status", operator: "equals", value: "Available" });
    statusMessage = "Filtered to show only Available products";
  }

  function handleClearFilters() {
    tableRef?.getAPI()?.clearAllFilters();
    statusMessage = "All filters cleared";
  }

  function handleGetInfo() {
    const api = tableRef?.getAPI();
    if (!api) return;
    const allRows = api.getAllRows();
    const hdrs = api.getHeaders();
    const sortState = api.getSortState();
    const filterState = api.getFilterState();
    const totalValue = allRows.reduce((sum: number, r: Record<string, unknown>) => sum + (r.price as number) * (r.stock as number), 0);
    const sortInfo = sortState ? `${sortState.key.label} (${sortState.direction})` : "None";
    alert(
      `Table Info:\n• Rows: ${allRows.length}\n• Columns: ${hdrs.length}\n• Active filters: ${Object.keys(filterState).length}\n• Sort: ${sortInfo}\n• Total inventory value: $${totalValue.toFixed(2)}`,
    );
    statusMessage = "Table info displayed";
  }
</script>

<div>
  <div style="margin-bottom: 12px; padding: 8px 12px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; color: #1e40af; font-size: 14px;">
    {statusMessage}
  </div>
  <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
    <button onclick={handleSortByName}>Sort by Name (A-Z)</button>
    <button onclick={handleSortByPrice}>Sort by Price (High to Low)</button>
    <button onclick={handleFilterAvailable}>Filter: Available</button>
    <button onclick={handleClearFilters}>Clear Filters</button>
    <button onclick={handleGetInfo}>Get Table Info</button>
  </div>
  <SimpleTable
    bind:this={tableRef}
    defaultHeaders={headers}
    rows={programmaticControlConfig.rows}
    {height}
    {theme}
  />
</div>
