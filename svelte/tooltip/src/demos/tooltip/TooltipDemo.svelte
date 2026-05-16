<script lang="ts">
  import {SimpleTable} from "@simple-table/svelte";  import type { Theme } from "@simple-table/svelte";
  import { tooltipConfig } from "./tooltip.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={tooltipConfig.headers}
  rows={tooltipConfig.rows}
  {height}
  {theme}
  columnResizing={true}
  columnReordering={true}
  selectableCells={true}
/>
