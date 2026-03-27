<template>
  <div>
    <div style="display: flex; gap: 8px; margin-bottom: 12px">
      <button @click="handleExport">Export CSV</button>
      <button @click="handleInfo">Table Info</button>
    </div>
    <SimpleTable
      ref="tableRef"
      :default-headers="csvExportConfig.headers"
      :rows="csvExportConfig.rows"
      :column-resizing="csvExportConfig.tableProps.columnResizing"
      :height="height"
      :theme="theme"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, TableAPI } from "@simple-table/vue";
import { csvExportConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const tableRef = ref<{ getAPI: () => TableAPI | null } | null>(null);

function handleExport() {
  tableRef.value?.getAPI()?.exportToCSV({ filename: "table-export" });
}

function handleInfo() {
  const api = tableRef.value?.getAPI();
  if (!api) return;
  const visibleRows = api.getVisibleRows();
  const headers = api.getHeaders();
  alert(`Columns: ${headers.length}\nVisible rows: ${visibleRows.length}`);
}
</script>
