<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { tooltipConfig } from "./tooltip.demo-data";
  import type { TooltipProduct } from "./tooltip.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<TooltipProduct>) => row.id;
</script>

<SimpleTable
  columns={tooltipConfig.headers}
  rows={tooltipConfig.rows}
  getRowId={getRowId}
  {height}
  {theme}
  columnResizing={true}
  columnReordering={true}
  selectableCells={true}
/>
