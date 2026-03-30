<script setup lang="ts">
import { ref, computed } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, TableFilterState } from "@simple-table/vue";
import { externalFilterConfig, matchesFilter } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const filters = ref<TableFilterState>({});

const filteredRows = computed(() => {
  const entries = Object.entries(filters.value);
  if (entries.length === 0) return externalFilterConfig.rows;

  return externalFilterConfig.rows.filter((row) =>
    entries.every(([accessor, filter]) =>
      matchesFilter(row[accessor as keyof typeof row] as any, filter)
    )
  );
});

function handleFilterChange(newFilters: TableFilterState) {
  filters.value = newFilters;
}
</script>

<template>
  <SimpleTable
    :default-headers="externalFilterConfig.headers"
    :rows="filteredRows"
    :external-filter-handling="true"
    :column-resizing="true"
    :height="props.height"
    :theme="props.theme"
    :on-filter-change="handleFilterChange"
  />
</template>
