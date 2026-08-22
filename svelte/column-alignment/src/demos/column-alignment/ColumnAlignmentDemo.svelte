<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { columnAlignmentConfig } from "./column-alignment.demo-data";
  import type { ColumnAlignmentPlayer } from "./column-alignment.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<ColumnAlignmentPlayer>) => row.id;
</script>

<SimpleTable
  columns={columnAlignmentConfig.headers}
  rows={columnAlignmentConfig.rows}
  getRowId={getRowId}
  {height}
  {theme}
/>
