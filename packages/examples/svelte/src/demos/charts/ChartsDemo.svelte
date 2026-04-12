<script lang="ts">
  import {SimpleTable} from "@simple-table/svelte";  import type { Theme } from "@simple-table/svelte";
  import { chartsConfig } from "./charts.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  columnReordering={chartsConfig.tableProps.columnReordering}
  columnResizing={chartsConfig.tableProps.columnResizing}
  defaultHeaders={chartsConfig.headers}
  rows={chartsConfig.rows}
  selectableCells={chartsConfig.tableProps.selectableCells}
  {height}
  {theme}
/>
