<template>
  <SimpleTable
    :default-headers="cellHighlightingConfig.headers"
    :rows="cellHighlightingConfig.rows"
    :height="height"
    :theme="theme"
    :selectable-cells="cellHighlightingConfig.tableProps.selectableCells"
    :selectable-columns="cellHighlightingConfig.tableProps.selectableColumns"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { cellHighlightingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
