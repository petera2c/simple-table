<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SvelteColumnDef } from "@simple-table/svelte";
  import { animationsConfig } from "./animations.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
  let headers: SvelteColumnDef[] = $state([...animationsConfig.headers]);

  function handleColumnOrderChange(newHeaders: SvelteColumnDef[]) {
    headers = newHeaders;
  }
</script>

<SimpleTable
  columnReordering
  columns={headers}
  enableColumnEditor
  enableColumnEditorInitOpen
  rows={animationsConfig.rows}
  {height}
  {theme}
  onColumnOrderChange={handleColumnOrderChange}
/>
