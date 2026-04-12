<script setup lang="ts">
import { ref, computed } from "vue";
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme, Row } from "@simple-table/vue";
import { infiniteScrollConfig, generateInfiniteScrollData } from "./infinite-scroll.demo-data";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const MAX_ROWS = 200;
const BATCH_SIZE = 15;

const rows = ref<Row[]>(generateInfiniteScrollData(0, 30) as Row[]);
const loading = ref(false);
const hasMore = ref(true);

const statusText = computed(() =>
  `${rows.value.length} rows loaded${hasMore.value ? "" : " (all loaded)"}`
);

function handleLoadMore() {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  setTimeout(() => {
    const newRows = generateInfiniteScrollData(rows.value.length, BATCH_SIZE) as Row[];
    rows.value = [...rows.value, ...newRows];
    if (rows.value.length >= MAX_ROWS) hasMore.value = false;
    loading.value = false;
  }, 500);
}
</script>

<template>
  <div>
    <div style="margin-bottom: 8px; font-size: 13px; color: #666">{{ statusText }}</div>
    <SimpleTable
      :default-headers="defaultHeadersFromCore(infiniteScrollConfig.headers)"
      :rows="rows"
      :is-loading="loading"
      :on-load-more="handleLoadMore"
      :height="props.height"
      :theme="props.theme"
    />
  </div>
</template>
