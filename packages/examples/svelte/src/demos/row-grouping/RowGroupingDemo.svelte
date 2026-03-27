<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { rowGroupingConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let tableRef: any;

  function handleExpandAll() {
    tableRef?.getAPI()?.expandAll();
  }

  function handleCollapseAll() {
    tableRef?.getAPI()?.collapseAll();
  }

  function handleExpandDepth0() {
    tableRef?.getAPI()?.expandDepth(0);
  }

  function handleToggleDepth1() {
    tableRef?.getAPI()?.toggleDepth(1);
  }
</script>

<div>
  <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
    <button onclick={handleExpandAll}>Expand All</button>
    <button onclick={handleCollapseAll}>Collapse All</button>
    <button onclick={handleExpandDepth0}>Expand Depth 0</button>
    <button onclick={handleToggleDepth1}>Toggle Depth 1</button>
  </div>
  <SimpleTable
    bind:this={tableRef}
    defaultHeaders={rowGroupingConfig.headers}
    rows={rowGroupingConfig.rows}
    rowGrouping={rowGroupingConfig.tableProps.rowGrouping}
    enableStickyParents={rowGroupingConfig.tableProps.enableStickyParents}
    getRowId={rowGroupingConfig.tableProps.getRowId}
    columnResizing={rowGroupingConfig.tableProps.columnResizing}
    {height}
    {theme}
  />
</div>
