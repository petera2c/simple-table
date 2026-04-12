<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SvelteHeaderObject } from "@simple-table/svelte";
  import { columnReorderingConfig } from "./column-reordering.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
  let headers: SvelteHeaderObject[] = $state([...columnReorderingConfig.headers]);

  function handleColumnOrderChange(newHeaders: SvelteHeaderObject[]) {
    headers = newHeaders;
  }
</script>

<SimpleTable
  columnReordering
  defaultHeaders={headers}
  rows={columnReorderingConfig.rows}
  {height}
  {theme}
  onColumnOrderChange={handleColumnOrderChange}
/>
