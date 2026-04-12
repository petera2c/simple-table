<template>
  <SimpleTable
    :default-headers="defaultHeadersFromCore(columnAlignmentConfig.headers)"
    :rows="columnAlignmentConfig.rows"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { columnAlignmentConfig } from "./column-alignment.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
