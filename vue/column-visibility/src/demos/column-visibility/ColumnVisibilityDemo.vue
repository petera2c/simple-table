<script setup lang="ts">
import {SimpleTable} from "@simple-table/vue";import type { ColumnVisibilityState, Theme } from "@simple-table/vue";
import MarketingColumnEditorRow from "./MarketingColumnEditorRow.vue";
import {
  columnVisibilityConfig,
  getColumnVisibilityDemoHeaders,
  loadColumnVisibilityDemoSaved,
  saveColumnVisibilityDemoState,
} from "./column-visibility.demo-data";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const columns = getColumnVisibilityDemoHeaders(loadColumnVisibilityDemoSaved());

const columnEditorConfig = {
  ...columnVisibilityConfig.tableProps.columnEditorConfig,
  rowRenderer: MarketingColumnEditorRow,
};

function onColumnVisibilityChange(state: ColumnVisibilityState) {
  saveColumnVisibilityDemoState(state);
}
</script>

<template>
  <SimpleTable
    :columns="columns"
    :rows="columnVisibilityConfig.rows"
    :enable-column-editor="columnVisibilityConfig.tableProps.enableColumnEditor"
    :enable-column-editor-init-open="columnVisibilityConfig.tableProps.enableColumnEditorInitOpen"
    :column-editor-config="columnEditorConfig"
    :height="props.height"
    :theme="props.theme"
    :on-column-visibility-change="onColumnVisibilityChange"
  />
</template>
