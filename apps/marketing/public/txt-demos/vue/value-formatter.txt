<template>
  <SimpleTable
    :default-headers="valueFormatterConfig.headers"
    :rows="valueFormatterConfig.rows"
    :height="height"
    :theme="theme"
    :selectable-cells="valueFormatterConfig.tableProps.selectableCells"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { valueFormatterConfig } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
