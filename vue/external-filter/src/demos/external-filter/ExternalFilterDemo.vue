<script setup lang="ts">
import { ref, computed } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, TableFilterState, GetRowIdParams } from "@simple-table/vue";
import { externalFilterConfig, matchesFilter } from "./external-filter.demo-data";
import type { FilterableEmployee } from "./external-filter.demo-data";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const filters = ref<TableFilterState<FilterableEmployee>>({});

const getRowId = ({ row }: GetRowIdParams<FilterableEmployee>) => row.id;

const filteredRows = computed(() => {
  const entries = Object.entries(filters.value);
  if (entries.length === 0) return externalFilterConfig.rows;

  return externalFilterConfig.rows.filter((row) =>
    entries.every(([accessor, filter]) =>
      matchesFilter(row[accessor as keyof FilterableEmployee], filter)
    )
  );
});

function handleFilterChange(newFilters: TableFilterState<FilterableEmployee>) {
  filters.value = newFilters;
}
</script>

<template>
  <SimpleTable
    :columns="externalFilterConfig.headers"
    :rows="filteredRows"
    :get-row-id="getRowId"
    :external-filter-handling="true"
    :column-resizing="true"
    :height="props.height"
    :theme="props.theme"
    :on-filter-change="handleFilterChange"
  />
</template>
