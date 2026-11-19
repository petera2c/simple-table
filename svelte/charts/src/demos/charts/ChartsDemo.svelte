<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { chartsConfig } from "./charts.demo-data";
  import type { ChartsProduct } from "./charts.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<ChartsProduct>) => row.id;
</script>

<SimpleTable
  columnReordering={chartsConfig.tableProps.columnReordering}
  columnResizing={chartsConfig.tableProps.columnResizing}
  columns={chartsConfig.headers}
  {getRowId}
  rows={chartsConfig.rows}
  selectableCells={chartsConfig.tableProps.selectableCells}
  {height}
  {theme}
/>
