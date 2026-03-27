<template>
  <SimpleTable
    :default-headers="columnFilteringConfig.headers"
    :rows="columnFilteringConfig.rows"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "simple-table-vue";
import type { Theme } from "simple-table-vue";
import { columnFilteringConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
