<template>
  <SimpleTable
    :column-reordering="animationsConfig.tableProps.columnReordering"
    :default-headers="headers"
    :edit-columns="animationsConfig.tableProps.editColumns"
    :edit-columns-init-open="animationsConfig.tableProps.editColumnsInitOpen"
    :rows="animationsConfig.rows"
    :height="height"
    :theme="theme"
    @column-order-change="handleColumnOrderChange"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, VueHeaderObject } from "@simple-table/vue";
import { animationsConfig } from "./animations.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const headers = ref<VueHeaderObject[]>([...animationsConfig.headers]);

const handleColumnOrderChange = (newHeaders: VueHeaderObject[]) => {
  headers.value = newHeaders;
};
</script>
