<template>
  <SimpleTable
    :columns="collapsibleColumnsConfig.headers"
    :rows="collapsibleColumnsConfig.rows"
    :get-row-id="getRowId"
    :column-resizing="true"
    :enable-column-editor="true"
    :selectable-cells="true"
    :column-reordering="true"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme, GetRowIdParams } from "@simple-table/vue";
import { collapsibleColumnsConfig } from "./collapsible-columns.demo-data";
import type { CollapsibleSalesRep } from "./collapsible-columns.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const getRowId = ({ row }: GetRowIdParams<CollapsibleSalesRep>) => row.id;
</script>
