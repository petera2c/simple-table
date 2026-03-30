<template>
  <SimpleTable
    :default-headers="aggregateFunctionsConfig.headers"
    :rows="aggregateFunctionsConfig.rows"
    :row-grouping="aggregateFunctionsConfig.tableProps.rowGrouping"
    :column-resizing="true"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { aggregateFunctionsConfig } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
