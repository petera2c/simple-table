<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { soccerConfig } from "./soccer.demo-data";
  import type { SoccerPlayer } from "./soccer.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "70dvh", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<SoccerPlayer>) => row.id;
</script>

<SimpleTable
  columns={soccerConfig.headers}
  rows={soccerConfig.rows}
  getRowId={getRowId}
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
