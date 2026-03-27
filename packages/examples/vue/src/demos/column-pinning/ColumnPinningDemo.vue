<template>
  <SimpleTable
    :default-headers="columnPinningConfig.headers"
    :rows="columnPinningConfig.rows"
    :height="height"
    :theme="theme"
    :column-resizing="true"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { columnPinningConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
