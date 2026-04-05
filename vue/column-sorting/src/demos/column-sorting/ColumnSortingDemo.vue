<template>
  <SimpleTable
    :default-headers="defaultHeadersFromCore(columnSortingConfig.headers)"
    :rows="columnSortingConfig.rows"
    :height="height"
    :theme="theme"
    :initial-sort-column="columnSortingConfig.tableProps.initialSortColumn"
    :initial-sort-direction="columnSortingConfig.tableProps.initialSortDirection"
  />
</template>

<script setup lang="ts">
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { columnSortingConfig } from "./column-sorting.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
