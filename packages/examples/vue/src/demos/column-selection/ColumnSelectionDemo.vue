<template>
  <SimpleTable
    :default-headers="defaultHeadersFromCore(columnSelectionConfig.headers)"
    :rows="columnSelectionConfig.rows"
    :height="height"
    :theme="theme"
    :selectable-columns="columnSelectionConfig.tableProps.selectableColumns"
  />
</template>

<script setup lang="ts">
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { columnSelectionConfig } from "./column-selection.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
