<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SvelteColumnDef, GetRowIdParams } from "@simple-table/svelte";
  import { columnReorderingConfig } from "./column-reordering.demo-data";
  import type { CrewMember } from "./column-reordering.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
  let headers: SvelteColumnDef<CrewMember>[] = $state([...columnReorderingConfig.headers]);

  const getRowId = ({ row }: GetRowIdParams<CrewMember>) => row.id;

  function handleColumnOrderChange(newHeaders: SvelteColumnDef<CrewMember>[]) {
    headers = newHeaders;
  }
</script>

<SimpleTable
  columnReordering
  columns={headers}
  rows={columnReorderingConfig.rows}
  getRowId={getRowId}
  {height}
  {theme}
  onColumnOrderChange={handleColumnOrderChange}
/>
