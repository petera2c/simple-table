<template>
  <SimpleTable
    :default-headers="collapsibleColumnsConfig.headers"
    :rows="collapsibleColumnsConfig.rows"
    :column-resizing="collapsibleColumnsConfig.tableProps.columnResizing"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { collapsibleColumnsConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
