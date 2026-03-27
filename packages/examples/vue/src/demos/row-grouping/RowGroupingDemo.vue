<template>
  <div>
    <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap">
      <button @click="handleExpandAll">Expand All</button>
      <button @click="handleCollapseAll">Collapse All</button>
      <button @click="handleExpandDepth0">Expand Depth 0</button>
      <button @click="handleToggleDepth1">Toggle Depth 1</button>
    </div>
    <SimpleTable
      ref="tableRef"
      :default-headers="rowGroupingConfig.headers"
      :rows="rowGroupingConfig.rows"
      :row-grouping="rowGroupingConfig.tableProps.rowGrouping"
      :enable-sticky-parents="rowGroupingConfig.tableProps.enableStickyParents"
      :get-row-id="rowGroupingConfig.tableProps.getRowId"
      :column-resizing="rowGroupingConfig.tableProps.columnResizing"
      :height="height"
      :theme="theme"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, TableAPI } from "@simple-table/vue";
import { rowGroupingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const tableRef = ref<{ getAPI: () => TableAPI | null } | null>(null);

function handleExpandAll() {
  tableRef.value?.getAPI()?.expandAll();
}

function handleCollapseAll() {
  tableRef.value?.getAPI()?.collapseAll();
}

function handleExpandDepth0() {
  tableRef.value?.getAPI()?.expandDepth(0);
}

function handleToggleDepth1() {
  tableRef.value?.getAPI()?.toggleDepth(1);
}
</script>
