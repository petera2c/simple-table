<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme, GetRowIdParams } from "@simple-table/vue";
import {
  columnEditorCustomRendererConfig,
  COLUMN_EDITOR_TEXT,
  COLUMN_EDITOR_SEARCH_PLACEHOLDER,
} from "./column-editor-custom-renderer.demo-data";
import type { ColumnEditorCustomRendererEmployee } from "./column-editor-custom-renderer.demo-data";
import ColumnEditorCustomRow from "./ColumnEditorCustomRow.vue";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const getRowId = ({ row }: GetRowIdParams<ColumnEditorCustomRendererEmployee>) => row.id;

const editorConfig = {
  text: COLUMN_EDITOR_TEXT,
  searchEnabled: true,
  searchPlaceholder: COLUMN_EDITOR_SEARCH_PLACEHOLDER,
  rowRenderer: ColumnEditorCustomRow,
};
</script>

<template>
  <SimpleTable
    :columns="columnEditorCustomRendererConfig.headers"
    :rows="columnEditorCustomRendererConfig.rows"
    :get-row-id="getRowId"
    :enable-column-editor="true"
    :column-editor-config="editorConfig"
    :height="props.height"
    :theme="props.theme"
  />
</template>
