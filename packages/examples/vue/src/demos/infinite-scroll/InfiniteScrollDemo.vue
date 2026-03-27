<template>
  <SimpleTable
    :default-headers="infiniteScrollConfig.headers"
    :rows="rows"
    :is-loading="loading"
    :height="height"
    :theme="theme"
    @load-more="handleLoadMore"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, Row } from "@simple-table/vue";
import { infiniteScrollConfig, generateInfiniteScrollData } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const BATCH_SIZE = 30;
const MAX_ROWS = 200;

const rows = ref<Row[]>([...infiniteScrollConfig.rows]);
const loading = ref(false);
const hasMore = ref(true);

function handleLoadMore() {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  setTimeout(() => {
    const newRows = generateInfiniteScrollData(rows.value.length, BATCH_SIZE);
    rows.value = [...rows.value, ...newRows];
    loading.value = false;
    if (rows.value.length >= MAX_ROWS) hasMore.value = false;
  }, 800);
}
</script>
