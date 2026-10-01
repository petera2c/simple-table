<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import MarketingColumnEditorRow from "./MarketingColumnEditorRow.svelte";
  import { columnVisibilityConfig } from "./column-visibility.demo-data";
  import type { VisibilityEmployee } from "./column-visibility.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const columns = columnVisibilityConfig.headers;
  const getRowId = ({ row }: GetRowIdParams<VisibilityEmployee>) => row.id;

  const columnEditorConfig = {
    ...columnVisibilityConfig.tableProps.columnEditorConfig,
    rowRenderer: MarketingColumnEditorRow,
  };
</script>

<SimpleTable
  {columns}
  rows={columnVisibilityConfig.rows}
  {getRowId}
  enableColumnEditor={columnVisibilityConfig.tableProps.enableColumnEditor}
  enableColumnEditorInitOpen={columnVisibilityConfig.tableProps.enableColumnEditorInitOpen}
  columnEditorConfig={columnEditorConfig}
  {height}
  {theme}
/>
