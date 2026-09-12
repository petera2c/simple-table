<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SvelteColumnDef, GetRowIdParams } from "@simple-table/svelte";
  import { animationsConfig } from "./animations.demo-data";
  import type { AnimationsCrewMember } from "./animations.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
  let headers: SvelteColumnDef<AnimationsCrewMember>[] = $state([...animationsConfig.headers]);

  const getRowId = ({ row }: GetRowIdParams<AnimationsCrewMember>) => row.id;

  function handleColumnOrderChange(newHeaders: SvelteColumnDef<AnimationsCrewMember>[]) {
    headers = newHeaders;
  }
</script>

<SimpleTable
  columnReordering
  columns={headers}
  enableColumnEditor
  enableColumnEditorInitOpen
  {getRowId}
  rows={animationsConfig.rows}
  {height}
  {theme}
  onColumnOrderChange={handleColumnOrderChange}
/>
