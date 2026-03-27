<template>
  <div>
    <div style="display: flex; gap: 8px; margin-bottom: 12px">
      <button @click="reload">Reload Data</button>
    </div>
    <SimpleTable
      :default-headers="loadingStateConfig.headers"
      :rows="data"
      :is-loading="isLoading"
      :height="height"
      :theme="theme"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, Row } from "@simple-table/vue";
import { loadingStateConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const isLoading = ref(true);
const data = ref<Row[]>([]);

function load() {
  isLoading.value = true;
  data.value = [];
  setTimeout(() => {
    data.value = [...loadingStateConfig.rows];
    isLoading.value = false;
  }, 2000);
}

function reload() {
  load();
}

onMounted(() => {
  load();
});
</script>
