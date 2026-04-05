<script lang="ts">
  import {SimpleTable, defaultHeadersFromCore} from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { columnPinningConfig } from "./column-pinning.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={defaultHeadersFromCore(columnPinningConfig.headers)}
  rows={columnPinningConfig.rows}
  {height}
  {theme}
  columnResizing={columnPinningConfig.tableProps.columnResizing}
/>
