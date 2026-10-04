<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { columnPinningConfig } from "./column-pinning.demo-data";
  import type { ColumnPinningEmployee } from "./column-pinning.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<ColumnPinningEmployee>) => row.id;
</script>

<SimpleTable
  columns={columnPinningConfig.headers}
  rows={columnPinningConfig.rows}
  getRowId={getRowId}
  {height}
  {theme}
  columnResizing={columnPinningConfig.tableProps.columnResizing}
/>
