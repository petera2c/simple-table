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
import type { Theme } from "@simple-table/vue";
import type { HeaderObject } from "simple-table-core";
import { columnReorderingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const headers = ref<HeaderObject[]>([...columnReorderingConfig.headers]);

const handleColumnOrderChange = (newHeaders: HeaderObject[]) => {
  headers.value = newHeaders;
};
</script>
