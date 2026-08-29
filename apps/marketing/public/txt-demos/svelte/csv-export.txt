<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SvelteColumnDef, TableAPI, GetRowIdParams } from "@simple-table/svelte";
  import { csvExportHeaders, csvExportData, csvExportConfig } from "./csv-export.demo-data";
  import type { CsvProduct } from "./csv-export.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let tableRef = $state<{ getAPI: () => TableAPI<CsvProduct> | null } | null>(null);

  const getRowId = ({ row }: GetRowIdParams<CsvProduct>) => row.id;

  const headers: SvelteColumnDef<CsvProduct>[] = csvExportHeaders.map((h) => {
    if (h.accessor === "actions") {
      return {
        ...h,
        cellRenderer: () =>
          `<button style="background:#3b82f6;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold">View</button>`,
      };
    }
    return { ...h };
  });

  function handleExport() {
    tableRef?.getAPI()?.exportToCSV();
  }

  function handleGetInfo() {
    const api = tableRef?.getAPI();
    if (!api) return;
    const rows = api.getAllRows();
    const hdrs = api.getHeaders();
    const totalRevenue = rows.reduce((sum, r) => sum + r.row.revenue, 0);
    alert(
      `Table Info:\n• ${rows.length} rows\n• ${hdrs.length} columns\n• Columns: ${hdrs.map((h) => h.label).join(", ")}\n• Total Revenue: $${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    );
  }
</script>

<div>
  <div style="display: flex; gap: 8px; margin-bottom: 12px;">
    <button style="padding: 6px 16px" onclick={handleExport}>Export to CSV</button>
    <button style="padding: 6px 16px" onclick={handleGetInfo}>Get Table Info</button>
  </div>
  <SimpleTable
    bind:this={tableRef}
    columns={headers}
    {getRowId}
    rows={csvExportData}
    enableColumnEditor={csvExportConfig.tableProps.enableColumnEditor}
    selectableCells={csvExportConfig.tableProps.selectableCells}
    customTheme={csvExportConfig.tableProps.customTheme}
    {height}
    {theme}
  />
</div>
