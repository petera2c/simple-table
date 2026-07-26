<template>
  <SimpleTable
    :auto-expand-columns="nestedTablesConfig.tableProps.autoExpandColumns"
    :columns="nestedTablesConfig.headers"
    :rows="sampleData"
    :row-grouping="nestedTablesConfig.tableProps.rowGrouping"
    :get-row-id="getRowId"
    :expand-all="nestedTablesConfig.tableProps.expandAll"
    :column-resizing="nestedTablesConfig.tableProps.columnResizing"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, GetRowIdParams } from "@simple-table/vue";
import {
  nestedTablesConfig,
  generateNestedTablesData,
  type NestedCompany,
} from "./nested-tables.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), { height: "500px" });

const sampleData = computed(() => generateNestedTablesData(25));

const getRowId = ({ row }: GetRowIdParams<NestedCompany>) => row.id;
</script>
