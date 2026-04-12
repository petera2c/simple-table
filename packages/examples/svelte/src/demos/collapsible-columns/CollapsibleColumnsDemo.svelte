<script lang="ts">
  import {SimpleTable} from "@simple-table/svelte";  import type { Theme } from "@simple-table/svelte";
  import { collapsibleColumnsConfig } from "./collapsible-columns.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={collapsibleColumnsConfig.headers}
  rows={collapsibleColumnsConfig.rows}
  columnResizing={true}
  editColumns={true}
  selectableCells={true}
  columnReordering={true}
  {height}
  {theme}
/>
