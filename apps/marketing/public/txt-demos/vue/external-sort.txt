<template>
  <SimpleTable
    :default-headers="externalSortConfig.headers"
    :rows="sortedRows"
    :external-sort-handling="true"
    :column-resizing="externalSortConfig.tableProps.columnResizing"
    :height="height"
    :theme="theme"
    @sort-change="handleSortChange"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, SortColumn } from "@simple-table/vue";
import { externalSortConfig } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const sortConfig = ref<SortColumn | null>(null);

const sortedRows = computed(() => {
  const data = [...externalSortConfig.rows];
  const sort = sortConfig.value;
  if (!sort) return data;

  const accessor = sort.key.accessor as string;
  const dir = sort.direction === "asc" ? 1 : -1;

  return data.sort((a, b) => {
    const aVal = a[accessor];
    const bVal = b[accessor];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return dir;
    if (bVal == null) return -dir;
    if (typeof aVal === "string" && typeof bVal === "string") return dir * aVal.localeCompare(bVal);
    return dir * (Number(aVal) - Number(bVal));
  });
});

function handleSortChange(sort: SortColumn | null) {
  sortConfig.value = sort;
}
</script>
