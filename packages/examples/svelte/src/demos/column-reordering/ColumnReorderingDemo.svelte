<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, HeaderObject } from "@simple-table/svelte";
  import { columnReorderingConfig } from "@simple-table/examples-shared";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
  let headers: HeaderObject[] = $state([...columnReorderingConfig.headers]);

  function handleColumnOrderChange(newHeaders: HeaderObject[]) {
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
