<template>
  <SimpleTable
    :columns="columnFilteringConfig.headers"
    :rows="columnFilteringConfig.rows"
    :get-row-id="getRowId"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme, GetRowIdParams } from "@simple-table/vue";
import { columnFilteringConfig } from "./column-filtering.demo-data";
import type { ColumnFilteringEmployee } from "./column-filtering.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const getRowId = ({ row }: GetRowIdParams<ColumnFilteringEmployee>) => row.id;
</script>
