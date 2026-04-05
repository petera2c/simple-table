<template>
  <SimpleTable
    :default-headers="defaultHeadersFromCore(columnPinningConfig.headers)"
    :rows="columnPinningConfig.rows"
    :height="height"
    :theme="theme"
    :column-resizing="columnPinningConfig.tableProps.columnResizing"
  />
</template>

<script setup lang="ts">
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { columnPinningConfig } from "./column-pinning.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
