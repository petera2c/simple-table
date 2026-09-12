<template>
  <SimpleTable
    :columns="columnAlignmentConfig.headers"
    :rows="columnAlignmentConfig.rows"
    :get-row-id="getRowId"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme, GetRowIdParams } from "@simple-table/vue";
import { columnAlignmentConfig } from "./column-alignment.demo-data";
import type { ColumnAlignmentPlayer } from "./column-alignment.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const getRowId = ({ row }: GetRowIdParams<ColumnAlignmentPlayer>) => row.id;
</script>
