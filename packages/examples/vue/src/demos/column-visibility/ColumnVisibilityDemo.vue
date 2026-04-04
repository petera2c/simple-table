<script setup lang="ts">
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { columnVisibilityConfig } from "./column-visibility.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>

<template>
  <SimpleTable
    :default-headers="defaultHeadersFromCore(columnVisibilityConfig.headers)"
    :rows="columnVisibilityConfig.rows"
    :edit-columns="columnVisibilityConfig.tableProps.editColumns"
    :column-editor-config="columnVisibilityConfig.tableProps.columnEditorConfig"
    :height="height"
    :theme="theme"
  />
</template>
