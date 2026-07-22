<template>
  <SimpleTable
    :columns="quickStartConfig.headers"
    :rows="quickStartConfig.rows"
    :height="height"
    :theme="theme"
    :enable-column-editor="quickStartConfig.tableProps.enableColumnEditor"
    :selectable-cells="quickStartConfig.tableProps.selectableCells"
    :custom-theme="quickStartConfig.tableProps.customTheme"
  />
</template>

<script setup lang="ts">
import {SimpleTable} from "@simple-table/vue";import type { Theme } from "@simple-table/vue";
import { quickStartConfig } from "./quick-start.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "300px",
});
</script>
