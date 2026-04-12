<template>
  <SimpleTable
    :default-headers="defaultHeadersFromCore(cellHighlightingConfig.headers)"
    :rows="cellHighlightingConfig.rows"
    :height="height"
    :theme="theme"
    :selectable-cells="cellHighlightingConfig.tableProps.selectableCells"
    :selectable-columns="cellHighlightingConfig.tableProps.selectableColumns"
  />
</template>

<script setup lang="ts">
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { cellHighlightingConfig } from "./cell-highlighting.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
