<template>
  <div>
    <div style="display: flex; gap: 8px; margin-bottom: 12px">
      <button style="padding: 6px 16px" @click="handleExport">Export to CSV</button>
      <button style="padding: 6px 16px" @click="handleGetInfo">Get Table Info</button>
    </div>
    <SimpleTable
      ref="tableRef"
      :columns="headers"
      :rows="csvExportData"
      :get-row-id="getRowId"
      :enable-column-editor="csvExportConfig.tableProps.enableColumnEditor"
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
import type { Theme, VueColumnDef, GetRowIdParams, SimpleTableExposed } from "@simple-table/vue";
import { csvExportHeaders, csvExportData, csvExportConfig } from "./csv-export.demo-data";
import type { CsvProduct } from "./csv-export.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const tableRef = ref<SimpleTableExposed<CsvProduct> | null>(null);
const getRowId = ({ row }: GetRowIdParams<CsvProduct>) => row.id;

const headers: VueColumnDef<CsvProduct>[] = csvExportHeaders.map((col) => {
  if (col.accessor === "actions") {
    return {
      ...col,
      cellRenderer: () =>
        `<button style="background:#3b82f6;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold">View</button>`,
    };
  }
  return { ...col };
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
