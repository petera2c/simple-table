<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import {
    columnEditorCustomRendererConfig,
    COLUMN_EDITOR_TEXT,
    COLUMN_EDITOR_SEARCH_PLACEHOLDER,
  } from "./column-editor-custom-renderer.demo-data";
  import type { ColumnEditorCustomRendererEmployee } from "./column-editor-custom-renderer.demo-data";
  import ColumnEditorCustomRow from "./ColumnEditorCustomRow.svelte";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<ColumnEditorCustomRendererEmployee>) => row.id;

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
  {getRowId}
  enableColumnEditor={true}
  columnEditorConfig={editorConfig}
  {height}
  {theme}
/>
