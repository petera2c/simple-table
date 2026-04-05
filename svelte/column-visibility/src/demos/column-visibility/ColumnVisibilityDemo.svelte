<script lang="ts">
  import {SimpleTable, defaultHeadersFromCore} from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { columnVisibilityConfig } from "./column-visibility.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={defaultHeadersFromCore(columnVisibilityConfig.headers)}
  rows={columnVisibilityConfig.rows}
  editColumns={columnVisibilityConfig.tableProps.editColumns}
  columnEditorConfig={columnVisibilityConfig.tableProps.columnEditorConfig}
  {height}
  {theme}
/>
