<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme, GetRowIdParams } from "@simple-table/vue";
import { tooltipConfig } from "./tooltip.demo-data";
import type { TooltipProduct } from "./tooltip.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const getRowId = ({ row }: GetRowIdParams<TooltipProduct>) => row.id;
</script>

<template>
  <SimpleTable
    :columns="tooltipConfig.headers"
    :rows="tooltipConfig.rows"
    :get-row-id="getRowId"
    :height="height"
    :theme="theme"
    :column-resizing="true"
    :column-reordering="true"
    :selectable-cells="true"
  />
</template>
