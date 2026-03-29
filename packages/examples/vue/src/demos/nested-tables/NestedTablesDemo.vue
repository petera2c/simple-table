<template>
  <SimpleTable
    :auto-expand-columns="nestedTablesConfig.tableProps.autoExpandColumns"
    :default-headers="nestedTablesConfig.headers"
    :rows="sampleData"
    :row-grouping="nestedTablesConfig.tableProps.rowGrouping"
    :get-row-id="nestedTablesConfig.tableProps.getRowId"
    :expand-all="nestedTablesConfig.tableProps.expandAll"
    :column-resizing="nestedTablesConfig.tableProps.columnResizing"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { nestedTablesConfig, generateNestedTablesData } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), { height: "500px" });

const sampleData = computed(() => generateNestedTablesData(25));
</script>
