<script lang="ts">
  import {SimpleTable} from "@simple-table/svelte";  import type { Theme } from "@simple-table/svelte";
  import { cellHighlightingConfig } from "./cell-highlighting.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={cellHighlightingConfig.headers}
  rows={cellHighlightingConfig.rows}
  {height}
  {theme}
  selectableCells={cellHighlightingConfig.tableProps.selectableCells}
  selectableColumns={cellHighlightingConfig.tableProps.selectableColumns}
/>
