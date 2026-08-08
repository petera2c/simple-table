<template>
  <SimpleTable
    :columns="columnSelectionConfig.headers"
    :rows="columnSelectionConfig.rows"
    :get-row-id="getRowId"
    :height="height"
    :theme="theme"
    :selectable-columns="columnSelectionConfig.tableProps.selectableColumns"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme, GetRowIdParams } from "@simple-table/vue";
import { columnSelectionConfig } from "./column-selection.demo-data";
import type { TeamMember } from "./column-selection.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const getRowId = ({ row }: GetRowIdParams<TeamMember>) => row.id;
</script>
