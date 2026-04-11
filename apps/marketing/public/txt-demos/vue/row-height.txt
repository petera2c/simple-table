<template>
  <SimpleTable
    :default-headers="rowHeightConfig.headers"
    :rows="rowHeightConfig.rows"
    :height="height"
    :theme="theme"
    :custom-theme="rowHeightConfig.tableProps.customTheme"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { rowHeightConfig } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
