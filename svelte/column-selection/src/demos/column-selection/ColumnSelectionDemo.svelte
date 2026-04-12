<script lang="ts">
  import {SimpleTable, defaultHeadersFromCore} from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { columnSelectionConfig } from "./column-selection.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={defaultHeadersFromCore(columnSelectionConfig.headers)}
  rows={columnSelectionConfig.rows}
  {height}
  {theme}
  selectableColumns={columnSelectionConfig.tableProps.selectableColumns}
/>
