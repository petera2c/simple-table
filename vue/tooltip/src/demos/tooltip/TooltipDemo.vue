<script setup lang="ts">
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { tooltipConfig } from "./tooltip.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>

<template>
  <SimpleTable
    :default-headers="defaultHeadersFromCore(tooltipConfig.headers)"
    :rows="tooltipConfig.rows"
    :height="height"
    :theme="theme"
    :column-resizing="true"
    :column-reordering="true"
    :selectable-cells="true"
  />
</template>
