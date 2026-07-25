<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { soccerConfig } from "./soccer.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "70dvh", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  columns={soccerConfig.headers}
  rows={soccerConfig.rows}
  {height}
  {theme}
  columnReordering
  columnResizing
  enableColumnEditor
  selectableCells
  initialSortColumn="rating"
  initialSortDirection="desc"
  customTheme={{ headerHeight: 40, rowHeight: 48 }}
/>
