<script lang="ts">
  import {SimpleTable} from "@simple-table/svelte";  import type { Theme } from "@simple-table/svelte";
  import { rowHeightConfig } from "./row-height.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={rowHeightConfig.headers}
  rows={rowHeightConfig.rows}
  {height}
  {theme}
  customTheme={rowHeightConfig.tableProps.customTheme}
/>
