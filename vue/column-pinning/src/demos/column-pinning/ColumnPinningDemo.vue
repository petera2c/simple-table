<template>
  <SimpleTable
    :columns="columnPinningConfig.headers"
    :rows="columnPinningConfig.rows"
    :get-row-id="getRowId"
    :height="height"
    :theme="theme"
    :column-resizing="columnPinningConfig.tableProps.columnResizing"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme, GetRowIdParams } from "@simple-table/vue";
import { columnPinningConfig } from "./column-pinning.demo-data";
import type { ColumnPinningEmployee } from "./column-pinning.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const getRowId = ({ row }: GetRowIdParams<ColumnPinningEmployee>) => row.id;
</script>
