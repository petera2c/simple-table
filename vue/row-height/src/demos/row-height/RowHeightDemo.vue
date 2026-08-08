<template>
  <SimpleTable
    :columns="rowHeightConfig.headers"
    :rows="rowHeightConfig.rows"
    :get-row-id="getRowId"
    :height="height"
    :theme="theme"
    :custom-theme="rowHeightConfig.tableProps.customTheme"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme, GetRowIdParams } from "@simple-table/vue";
import { rowHeightConfig } from "./row-height.demo-data";
import type { ArchitectStaff } from "./row-height.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const getRowId = ({ row }: GetRowIdParams<ArchitectStaff>) => row.id;
</script>
