<template>
  <div>
    <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap">
      <button @click="handleSort">Sort by Name (asc)</button>
      <button @click="handleFilter">Filter: Salary &gt; 100k</button>
      <button @click="handleClearFilters">Clear Filters</button>
      <button @click="handleInfo">Sort/Filter Info</button>
    </div>
    <SimpleTable
      ref="tableRef"
      :default-headers="programmaticControlConfig.headers"
      :rows="programmaticControlConfig.rows"
      :column-resizing="programmaticControlConfig.tableProps.columnResizing"
      :height="height"
      :theme="theme"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, TableAPI } from "@simple-table/vue";
import { programmaticControlConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const tableRef = ref<{ getAPI: () => TableAPI | null } | null>(null);

function handleSort() {
  tableRef.value?.getAPI()?.applySortState({ accessor: "name", direction: "asc" });
}

function handleFilter() {
  tableRef.value?.getAPI()?.applyFilter({
    accessor: "salary",
    operator: "greaterThan",
    value: 100000,
  });
}

function handleClearFilters() {
  tableRef.value?.getAPI()?.clearAllFilters();
}

function handleInfo() {
  const api = tableRef.value?.getAPI();
  if (!api) return;
  const sort = api.getSortState();
  const filters = api.getFilterState();
  const sortInfo = sort ? `${sort.key.accessor} (${sort.direction})` : "none";
  const filterCount = Object.keys(filters).length;
  alert(`Sort: ${sortInfo}\nActive filters: ${filterCount}`);
}
</script>
