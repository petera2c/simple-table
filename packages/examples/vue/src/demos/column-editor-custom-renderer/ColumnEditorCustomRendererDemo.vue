<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import {
  columnEditorCustomRendererConfig,
  COLUMN_EDITOR_TEXT,
  COLUMN_EDITOR_SEARCH_PLACEHOLDER,
  buildVanillaColumnEditorRowRenderer,
} from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const editorConfig = {
  text: COLUMN_EDITOR_TEXT,
  searchEnabled: true,
  searchPlaceholder: COLUMN_EDITOR_SEARCH_PLACEHOLDER,
  rowRenderer: buildVanillaColumnEditorRowRenderer,
};
</script>

<template>
  <SimpleTable
    :default-headers="columnEditorCustomRendererConfig.headers"
    :rows="columnEditorCustomRendererConfig.rows"
    :edit-columns="true"
    :column-editor-config="editorConfig"
    :height="props.height"
    :theme="props.theme"
  />
</template>
