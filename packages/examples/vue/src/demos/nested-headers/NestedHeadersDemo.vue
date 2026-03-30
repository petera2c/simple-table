<template>
  <SimpleTable
    :default-headers="nestedHeadersConfig.headers"
    :rows="nestedHeadersConfig.rows"
    :height="height"
    :theme="theme"
    :column-resizing="nestedHeadersConfig.tableProps.columnResizing"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { nestedHeadersConfig } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
