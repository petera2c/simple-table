<template>
  <div>
    <div style="display: flex; gap: 8px; margin-bottom: 12px">
      <button style="padding: 6px 16px" @click="handleExport">Export to CSV</button>
      <button style="padding: 6px 16px" @click="handleGetInfo">Get Table Info</button>
    </div>
    <SimpleTable
      ref="tableRef"
      :default-headers="headers"
      :rows="csvExportData"
      :edit-columns="csvExportConfig.tableProps.editColumns"
      :selectable-cells="csvExportConfig.tableProps.selectableCells"
      :custom-theme="csvExportConfig.tableProps.customTheme"
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
import { csvExportHeaders, csvExportData, csvExportConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const tableRef = ref<{ getAPI: () => TableAPI | null } | null>(null);

const headers: HeaderObject[] = csvExportHeaders.map((h) => {
  if (h.accessor === "actions") {
    return {
      ...h,
      cellRenderer: () =>
        `<button style="background:#3b82f6;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold">View</button>`,
    };
  }
  return { ...h };
});

function handleExport() {
  tableRef.value?.getAPI()?.exportToCSV();
}

function handleGetInfo() {
  const api = tableRef.value?.getAPI();
  if (!api) return;
  const rows = api.getAllRows();
  const hdrs = api.getHeaders();
  const totalRevenue = rows.reduce((sum, r) => sum + (Number(r.revenue) || 0), 0);
  alert(
    `Table Info:\n• ${rows.length} rows\n• ${hdrs.length} columns\n• Columns: ${hdrs.map((h) => h.label).join(", ")}\n• Total Revenue: $${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  );
}
</script>
