<template>
  <SimpleTable
    :column-reordering="chartsConfig.tableProps.columnReordering"
    :column-resizing="chartsConfig.tableProps.columnResizing"
    :default-headers="chartsConfig.headers"
    :rows="chartsConfig.rows"
    :selectable-cells="chartsConfig.tableProps.selectableCells"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import {SimpleTable} from "@simple-table/vue";import type { Theme } from "@simple-table/vue";
import { chartsConfig } from "./charts.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), { height: "400px" });
</script>
