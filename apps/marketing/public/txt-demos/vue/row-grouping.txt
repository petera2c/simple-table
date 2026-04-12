<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center">
      <span style="font-size: 13px; font-weight: 600; margin-right: 8px">Control Expansion:</span>
      <button :style="btnStyle('#28a745')" @click="expandAll" title="expandAll()">Expand All</button>
      <button :style="btnStyle('#dc3545')" @click="collapseAll" title="collapseAll()">Collapse All</button>
      <button :style="btnStyle('#007bff')" @click="onlyDivisions" title="expandDepth(0)">Only Divisions</button>
      <button :style="btnStyle('#6c757d')" @click="divisionsAndDepts" title="setExpandedDepths(new Set([0, 1]))">Divisions + Departments</button>
      <button :style="btnStyle('#6f42c1')" @click="toggleDivisions" title="toggleDepth(0)">Toggle Divisions</button>
    </div>
    <SimpleTable
      ref="tableRef"
      :default-headers="defaultHeadersFromCore(rowGroupingConfig.headers)"
      :rows="rowGroupingConfig.rows"
      :row-grouping="rowGroupingConfig.tableProps.rowGrouping"
      :enable-sticky-parents="true"
      :get-row-id="rowGroupingConfig.tableProps.getRowId"
      :column-resizing="true"
      :height="height"
      :theme="theme"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme, TableAPI } from "@simple-table/vue";
import { rowGroupingConfig } from "./row-grouping.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const tableRef = ref<{ getAPI: () => TableAPI | null } | null>(null);

function btnStyle(color: string) {
  return {
    padding: "6px 12px",
    background: color,
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
  };
}

function expandAll() { tableRef.value?.getAPI()?.expandAll(); }
function collapseAll() { tableRef.value?.getAPI()?.collapseAll(); }
function onlyDivisions() { tableRef.value?.getAPI()?.collapseAll(); tableRef.value?.getAPI()?.expandDepth(0); }
function divisionsAndDepts() { tableRef.value?.getAPI()?.setExpandedDepths(new Set([0, 1])); }
function toggleDivisions() { tableRef.value?.getAPI()?.toggleDepth(0); }
</script>
