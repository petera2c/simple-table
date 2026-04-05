<template>
  <SimpleTable
    :default-headers="defaultHeadersFromCore(nestedHeadersConfig.headers)"
    :rows="nestedHeadersConfig.rows"
    :height="height"
    :theme="theme"
    :column-resizing="nestedHeadersConfig.tableProps.columnResizing"
  />
</template>

<script setup lang="ts">
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { nestedHeadersConfig } from "./nested-headers.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
