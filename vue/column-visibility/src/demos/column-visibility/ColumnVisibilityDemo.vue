<script setup lang="ts">
import { SimpleTable, defaultHeadersFromCore } from "@simple-table/vue";
import type { ColumnVisibilityState, Theme } from "@simple-table/vue";
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

const defaultHeaders = defaultHeadersFromCore(getColumnVisibilityDemoHeaders(loadColumnVisibilityDemoSaved()));

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
    :default-headers="defaultHeaders"
    :rows="columnVisibilityConfig.rows"
    :edit-columns="columnVisibilityConfig.tableProps.editColumns"
    :edit-columns-init-open="columnVisibilityConfig.tableProps.editColumnsInitOpen"
    :column-editor-config="columnEditorConfig"
    :height="props.height"
    :theme="props.theme"
    :on-column-visibility-change="onColumnVisibilityChange"
  />
</template>
