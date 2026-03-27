<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { csvExportConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let tableRef: any;

  function handleExport() {
    tableRef?.getAPI()?.exportToCSV({ filename: "table-export" });
  }

  function handleInfo() {
    const api = tableRef?.getAPI();
    if (!api) return;
    const visibleRows = api.getVisibleRows();
    const headers = api.getHeaders();
    alert(`Columns: ${headers.length}\nVisible rows: ${visibleRows.length}`);
  }
</script>

<div>
  <div style="display: flex; gap: 8px; margin-bottom: 12px;">
    <button onclick={handleExport}>Export CSV</button>
    <button onclick={handleInfo}>Table Info</button>
  </div>
  <SimpleTable
    bind:this={tableRef}
    defaultHeaders={csvExportConfig.headers}
    rows={csvExportConfig.rows}
    columnResizing={csvExportConfig.tableProps.columnResizing}
    {height}
    {theme}
  />
</div>
