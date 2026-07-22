<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SvelteColumnDef } from "@simple-table/svelte";
  import { columnReorderingConfig } from "./column-reordering.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
  let headers: SvelteColumnDef[] = $state([...columnReorderingConfig.headers]);

  function handleColumnOrderChange(newHeaders: SvelteColumnDef[]) {
    headers = newHeaders;
  }
</script>

<SimpleTable
  columnReordering
  columns={headers}
  rows={columnReorderingConfig.rows}
  {height}
  {theme}
  onColumnOrderChange={handleColumnOrderChange}
/>
