<template>
  <div>
    <div
      style="
        margin-bottom: 12px;
        padding: 8px 12px;
        background-color: #eff6ff;
        border: 1px solid #bfdbfe;
        border-radius: 6px;
        color: #1e40af;
        font-size: 14px;
      "
    >
      {{ statusMessage }}
    </div>
    <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap">
      <button @click="handleSortByName">Sort by Name (A-Z)</button>
      <button @click="handleSortByPrice">Sort by Price (High to Low)</button>
      <button @click="handleFilterAvailable">Filter: Available</button>
      <button @click="handleClearFilters">Clear Filters</button>
      <button @click="handleGetInfo">Get Table Info</button>
    </div>
    <SimpleTable
      ref="tableRef"
      :default-headers="headers"
      :rows="programmaticControlConfig.rows"
      :height="height"
      :theme="theme"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, TableAPI } from "@simple-table/vue";
import type { HeaderObject } from "simple-table-core";
import { programmaticControlConfig, PROGRAMMATIC_CONTROL_STATUS_COLORS } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const tableRef = ref<{ getAPI: () => TableAPI | null } | null>(null);
const statusMessage = ref("No status message");

const headers: HeaderObject[] = programmaticControlConfig.headers.map((h) => {
  if (h.accessor === "status") {
    return {
      ...h,
      cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
        const s = String(row.status);
        const colors = PROGRAMMATIC_CONTROL_STATUS_COLORS[s] ?? { bg: "#f3f4f6", color: "#374151" };
        return `<span style="background:${colors.bg};color:${colors.color};padding:4px 8px;border-radius:4px;font-size:12px;font-weight:bold">${s}</span>`;
      },
    };
  }
  return { ...h };
});

function handleSortByName() {
  tableRef.value?.getAPI()?.applySortState({ accessor: "name", direction: "asc" });
  statusMessage.value = "Sorted by Name (A-Z)";
}

function handleSortByPrice() {
  tableRef.value?.getAPI()?.applySortState({ accessor: "price", direction: "desc" });
  statusMessage.value = "Sorted by Price (High to Low)";
}

function handleFilterAvailable() {
  tableRef.value?.getAPI()?.applyFilter({ accessor: "status", operator: "equals", value: "Available" });
  statusMessage.value = "Filtered to show only Available products";
}

function handleClearFilters() {
  tableRef.value?.getAPI()?.clearAllFilters();
  statusMessage.value = "All filters cleared";
}

function handleGetInfo() {
  const api = tableRef.value?.getAPI();
  if (!api) return;
  const allRows = api.getAllRows();
  const hdrs = api.getHeaders();
  const sortState = api.getSortState();
  const filterState = api.getFilterState();
  const totalValue = allRows.reduce((sum, r) => sum + (r.price as number) * (r.stock as number), 0);
  const sortInfo = sortState ? `${sortState.key.label} (${sortState.direction})` : "None";
  alert(
    `Table Info:\n• Rows: ${allRows.length}\n• Columns: ${hdrs.length}\n• Active filters: ${Object.keys(filterState).length}\n• Sort: ${sortInfo}\n• Total inventory value: $${totalValue.toFixed(2)}`,
  );
  statusMessage.value = "Table info displayed";
}
</script>
