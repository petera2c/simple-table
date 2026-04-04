<template>
  <SimpleTable
    :column-reordering="true"
    :default-headers="headers"
    :rows="columnReorderingConfig.rows"
    :height="height"
    :theme="theme"
    @column-order-change="handleColumnOrderChange"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, HeaderObject } from "@simple-table/vue";
import { columnReorderingConfig } from "./column-reordering.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const headers = ref<HeaderObject[]>([...columnReorderingConfig.headers]);

const handleColumnOrderChange = (newHeaders: HeaderObject[]) => {
  headers.value = newHeaders;
};
</script>
