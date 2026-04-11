<template>
  <SimpleTable
    :default-headers="collapsibleColumnsConfig.headers"
    :rows="collapsibleColumnsConfig.rows"
    :column-resizing="true"
    :edit-columns="true"
    :selectable-cells="true"
    :column-reordering="true"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { collapsibleColumnsConfig } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>
