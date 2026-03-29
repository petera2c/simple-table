<template>
  <div style="position: relative; height: 100%">
    <div
      v-if="saveMessage"
      style="position: absolute; top: 8px; right: 8px; background: #10b981; color: white; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.15);"
    >
      {{ saveMessage }}
    </div>
    <SimpleTable
      :column-resizing="true"
      :default-headers="headers"
      :rows="columnResizingData"
      :height="height"
      :theme="theme"
      @column-width-change="handleColumnWidthChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import type { HeaderObject } from "simple-table-core";
import { columnResizingHeaders, columnResizingData, COLUMN_RESIZING_STORAGE_KEY } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const headers = ref<HeaderObject[]>([...columnResizingHeaders]);
const saveMessage = ref("");

onMounted(() => {
  try {
    const saved = localStorage.getItem(COLUMN_RESIZING_STORAGE_KEY);
    if (saved) {
      const widthMap = JSON.parse(saved);
      headers.value = columnResizingHeaders.map((h) => ({
        ...h,
        width: widthMap[h.accessor] ?? h.width,
      }));
    }
  } catch { /* ignore */ }
});

function handleColumnWidthChange(updatedHeaders: HeaderObject[]) {
  try {
    const widthMap = updatedHeaders.reduce(
      (acc: Record<string, unknown>, h) => { acc[h.accessor] = h.width; return acc; },
      {},
    );
    localStorage.setItem(COLUMN_RESIZING_STORAGE_KEY, JSON.stringify(widthMap));
    headers.value = updatedHeaders;
    saveMessage.value = "Column widths saved!";
    setTimeout(() => { saveMessage.value = ""; }, 2000);
  } catch {
    saveMessage.value = "Failed to save widths";
    setTimeout(() => { saveMessage.value = ""; }, 2000);
  }
}
</script>
