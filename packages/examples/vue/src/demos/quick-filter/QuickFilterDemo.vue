<template>
  <SimpleTable
    :default-headers="quickFilterConfig.headers"
    :rows="quickFilterConfig.rows"
    :height="height"
    :theme="theme"
    :quick-filter="quickFilterConfig.tableProps.quickFilter"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { quickFilterConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
