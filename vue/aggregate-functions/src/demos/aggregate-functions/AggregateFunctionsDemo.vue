<template>
  <SimpleTable
    :columns="aggregateFunctionsConfig.headers"
    :rows="aggregateFunctionsConfig.rows"
    :get-row-id="getRowId"
    :row-grouping="aggregateFunctionsConfig.tableProps.rowGrouping"
    :column-resizing="true"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme, GetRowIdParams } from "@simple-table/vue";
import { aggregateFunctionsConfig } from "./aggregate-functions.demo-data";
import type { AggregateFunctionsRow } from "./aggregate-functions.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const getRowId = ({ row }: GetRowIdParams<AggregateFunctionsRow>) => row.id;
</script>
