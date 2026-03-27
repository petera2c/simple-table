<template>
  <SimpleTable
    :default-headers="quickStartConfig.headers"
    :rows="quickStartConfig.rows"
    :height="height"
    :theme="theme"
    :edit-columns="quickStartConfig.tableProps.editColumns"
    :selectable-cells="quickStartConfig.tableProps.selectableCells"
    :custom-theme="quickStartConfig.tableProps.customTheme"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "simple-table-vue";
import type { Theme } from "simple-table-vue";
import { quickStartConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "300px",
});
</script>
