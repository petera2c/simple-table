<script setup lang="ts">
import { ref, onMounted } from "vue";
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme, Row } from "@simple-table/vue";
import { loadingStateConfig } from "./loading-state.demo-data";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const isLoading = ref(true);
const data = ref<Row[]>([]);

function loadData() {
  isLoading.value = true;
  data.value = [];
  setTimeout(() => {
    data.value = [...loadingStateConfig.rows];
    isLoading.value = false;
  }, 2000);
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div>
    <div style="margin-bottom: 12px">
      <button
        @click="loadData"
        :disabled="isLoading"
        :style="{ padding: '6px 16px', cursor: isLoading ? 'not-allowed' : 'pointer' }"
      >
        {{ isLoading ? 'Loading\u2026' : 'Reload Data' }}
      </button>
    </div>
    <SimpleTable
      :default-headers="defaultHeadersFromCore(loadingStateConfig.headers)"
      :rows="data"
      :is-loading="isLoading"
      :height="props.height"
      :theme="props.theme"
    />
  </div>
</template>
