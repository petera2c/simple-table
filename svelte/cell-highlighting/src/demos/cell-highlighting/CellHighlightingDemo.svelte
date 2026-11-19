<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { cellHighlightingConfig } from "./cell-highlighting.demo-data";
  import type { CellHighlightingEmployee } from "./cell-highlighting.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<CellHighlightingEmployee>) => row.id;
</script>

<SimpleTable
  columns={cellHighlightingConfig.headers}
  rows={cellHighlightingConfig.rows}
  getRowId={getRowId}
  {height}
  {theme}
  selectableCells={cellHighlightingConfig.tableProps.selectableCells}
  selectableColumns={cellHighlightingConfig.tableProps.selectableColumns}
/>
