<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import {
    columnEditorCustomRendererConfig,
    COLUMN_EDITOR_TEXT,
    COLUMN_EDITOR_SEARCH_PLACEHOLDER,
  } from "./column-editor-custom-renderer.demo-data";
  import ColumnEditorCustomRow from "./ColumnEditorCustomRow.svelte";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const editorConfig = {
    text: COLUMN_EDITOR_TEXT,
    searchEnabled: true,
    searchPlaceholder: COLUMN_EDITOR_SEARCH_PLACEHOLDER,
    rowRenderer: ColumnEditorCustomRow,
  };
</script>

<SimpleTable
  columns={columnEditorCustomRendererConfig.headers}
  rows={columnEditorCustomRendererConfig.rows}
  enableColumnEditor={true}
  columnEditorConfig={editorConfig}
  {height}
  {theme}
/>
