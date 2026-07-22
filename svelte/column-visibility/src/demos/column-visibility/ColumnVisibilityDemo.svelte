<script lang="ts">
  import {SimpleTable} from "@simple-table/svelte";  import type { Theme } from "@simple-table/svelte";
  import MarketingColumnEditorRow from "./MarketingColumnEditorRow.svelte";
  import { columnVisibilityConfig } from "./column-visibility.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const columns = columnVisibilityConfig.headers;

  const columnEditorConfig = {
    ...columnVisibilityConfig.tableProps.columnEditorConfig,
    rowRenderer: MarketingColumnEditorRow,
  };
</script>

<SimpleTable
  {columns}
  rows={columnVisibilityConfig.rows}
  enableColumnEditor={columnVisibilityConfig.tableProps.enableColumnEditor}
  enableColumnEditorInitOpen={columnVisibilityConfig.tableProps.enableColumnEditorInitOpen}
  columnEditorConfig={columnEditorConfig}
  {height}
  {theme}
/>
