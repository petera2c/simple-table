<template>
  <SimpleTable
    :columns="valueFormatterConfig.headers"
    :rows="valueFormatterConfig.rows"
    :get-row-id="getRowId"
    :height="height"
    :theme="theme"
    :selectable-cells="valueFormatterConfig.tableProps.selectableCells"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme, GetRowIdParams } from "@simple-table/vue";
import { valueFormatterConfig } from "./value-formatter.demo-data";
import type { FormattedEmployee } from "./value-formatter.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const getRowId = ({ row }: GetRowIdParams<FormattedEmployee>) => row.id;
</script>
