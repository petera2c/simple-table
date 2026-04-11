<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { columnVisibilityConfig } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>

<template>
  <SimpleTable
    :default-headers="columnVisibilityConfig.headers"
    :rows="columnVisibilityConfig.rows"
    :edit-columns="columnVisibilityConfig.tableProps.editColumns"
    :column-editor-config="columnVisibilityConfig.tableProps.columnEditorConfig"
    :height="height"
    :theme="theme"
  />
</template>
