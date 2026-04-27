<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SvelteHeaderObject } from "@simple-table/svelte";
  import { animationsConfig } from "./animations.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
  let headers: SvelteHeaderObject[] = $state([...animationsConfig.headers]);

  function handleColumnOrderChange(newHeaders: SvelteHeaderObject[]) {
    headers = newHeaders;
  }
</script>

<SimpleTable
  columnReordering
  defaultHeaders={headers}
  editColumns
  editColumnsInitOpen
  rows={animationsConfig.rows}
  {height}
  {theme}
  onColumnOrderChange={handleColumnOrderChange}
/>
