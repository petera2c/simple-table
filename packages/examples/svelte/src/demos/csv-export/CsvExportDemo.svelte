<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, HeaderObject } from "@simple-table/svelte";
  import { csvExportHeaders, csvExportData, csvExportConfig } from "./csv-export.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let tableRef: any;

  const headers: HeaderObject[] = csvExportHeaders.map((h) => {
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
    const totalRevenue = rows.reduce((sum: number, r: Record<string, unknown>) => sum + (Number(r.revenue) || 0), 0);
    alert(
      `Table Info:\n• ${rows.length} rows\n• ${hdrs.length} columns\n• Columns: ${hdrs.map((h: { label: string }) => h.label).join(", ")}\n• Total Revenue: $${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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
    defaultHeaders={headers}
    rows={csvExportData}
    editColumns={csvExportConfig.tableProps.editColumns}
    selectableCells={csvExportConfig.tableProps.selectableCells}
    customTheme={csvExportConfig.tableProps.customTheme}
    {height}
    {theme}
  />
</div>
