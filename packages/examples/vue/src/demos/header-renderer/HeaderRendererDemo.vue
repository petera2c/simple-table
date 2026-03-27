<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { headerRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>

<template>
  <SimpleTable
    :default-headers="headerRendererConfig.headers"
    :rows="headerRendererConfig.rows"
    :column-resizing="headerRendererConfig.tableProps.columnResizing"
    :selectable-cells="headerRendererConfig.tableProps.selectableCells"
    :height="height"
    :theme="theme"
  />
</template>
