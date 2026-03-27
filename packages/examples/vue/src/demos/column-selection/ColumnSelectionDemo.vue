<template>
  <SimpleTable
    :default-headers="columnSelectionConfig.headers"
    :rows="columnSelectionConfig.rows"
    :height="height"
    :theme="theme"
    :selectable-columns="columnSelectionConfig.tableProps.selectableColumns"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { columnSelectionConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
