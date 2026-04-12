<script lang="ts">
  import {SimpleTable, defaultHeadersFromCore} from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { quickStartConfig } from "./quick-start.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "300px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={defaultHeadersFromCore(quickStartConfig.headers)}
  rows={quickStartConfig.rows}
  {height}
  {theme}
  editColumns={quickStartConfig.tableProps.editColumns}
  selectableCells={quickStartConfig.tableProps.selectableCells}
  customTheme={quickStartConfig.tableProps.customTheme}
/>
