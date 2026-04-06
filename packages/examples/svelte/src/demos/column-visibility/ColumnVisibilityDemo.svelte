<script lang="ts">
  import { SimpleTable, defaultHeadersFromCore } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import MarketingColumnEditorRow from "./MarketingColumnEditorRow.svelte";
  import { columnVisibilityConfig } from "./column-visibility.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const defaultHeaders = defaultHeadersFromCore(columnVisibilityConfig.headers);

  const columnEditorConfig = {
    ...columnVisibilityConfig.tableProps.columnEditorConfig,
    rowRenderer: MarketingColumnEditorRow,
  };
</script>

<SimpleTable
  {defaultHeaders}
  rows={columnVisibilityConfig.rows}
  editColumns={columnVisibilityConfig.tableProps.editColumns}
  editColumnsInitOpen={columnVisibilityConfig.tableProps.editColumnsInitOpen}
  columnEditorConfig={columnEditorConfig}
  {height}
  {theme}
/>
