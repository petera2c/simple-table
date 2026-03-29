<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { tooltipConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>

<template>
  <SimpleTable
    :default-headers="tooltipConfig.headers"
    :rows="tooltipConfig.rows"
    :height="height"
    :theme="theme"
    :column-resizing="true"
    :column-reordering="true"
    :selectable-cells="true"
  />
</template>
