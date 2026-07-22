<script lang="ts">
  import {SimpleTable} from "@simple-table/svelte";  import type { Theme } from "@simple-table/svelte";
  import { quickStartConfig } from "./quick-start.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "300px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  columns={quickStartConfig.headers}
  rows={quickStartConfig.rows}
  {height}
  {theme}
  enableColumnEditor={quickStartConfig.tableProps.enableColumnEditor}
  selectableCells={quickStartConfig.tableProps.selectableCells}
  customTheme={quickStartConfig.tableProps.customTheme}
/>
