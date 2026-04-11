<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import type { HeaderObject } from "simple-table-core";
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
