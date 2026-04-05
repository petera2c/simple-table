<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, HeaderObject } from "@simple-table/svelte";
  import { columnResizingHeaders, columnResizingData, COLUMN_RESIZING_STORAGE_KEY } from "./column-resizing.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let headers: HeaderObject[] = $state([...columnResizingHeaders]);
  let saveMessage = $state("");

  $effect(() => {
    try {
      const saved = localStorage.getItem(COLUMN_RESIZING_STORAGE_KEY);
      if (saved) {
        const widthMap = JSON.parse(saved);
        headers = columnResizingHeaders.map((h) => ({ ...h, width: widthMap[h.accessor] ?? h.width }));
      }
    } catch { /* ignore */ }
  });

  function handleColumnWidthChange(updatedHeaders: HeaderObject[]) {
    try {
      const widthMap: Record<string, unknown> = {};
      for (const h of updatedHeaders) widthMap[h.accessor] = h.width;
      localStorage.setItem(COLUMN_RESIZING_STORAGE_KEY, JSON.stringify(widthMap));
      headers = updatedHeaders;
      saveMessage = "Column widths saved!";
      setTimeout(() => { saveMessage = ""; }, 2000);
    } catch {
      saveMessage = "Failed to save widths";
      setTimeout(() => { saveMessage = ""; }, 2000);
    }
  }
</script>

<div style="position: relative; height: 100%">
  {#if saveMessage}
    <div style="position: absolute; top: 8px; right: 8px; background: #10b981; color: white; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
      {saveMessage}
    </div>
  {/if}
  <SimpleTable
    columnResizing={true}
    defaultHeaders={headers}
    rows={columnResizingData}
    {height}
    {theme}
    onColumnWidthChange={handleColumnWidthChange}
  />
</div>
