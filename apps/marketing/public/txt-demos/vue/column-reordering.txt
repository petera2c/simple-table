<template>
  <SimpleTable
    :column-reordering="true"
    :columns="headers"
    :rows="columnReorderingConfig.rows"
    :height="height"
    :theme="theme"
    @column-order-change="handleColumnOrderChange"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, VueColumnDef } from "@simple-table/vue";
import { columnReorderingConfig } from "./column-reordering.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const headers = ref<VueColumnDef[]>([...columnReorderingConfig.headers]);

const handleColumnOrderChange = (newHeaders: VueColumnDef[]) => {
  headers.value = newHeaders;
};
</script>
