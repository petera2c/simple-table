<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: formatHeight,
      overflow: 'hidden',
    }"
  >
    <div
      :style="{
        padding: '0 0 12px',
        borderBottom: `1px solid ${chrome.border}`,
        flexShrink: 0,
      }"
    >
      <div style="margin-bottom: 10px">
        <h2
          :style="{
            margin: 0,
            fontSize: '18px',
            fontWeight: 650,
            color: chrome.title,
            letterSpacing: '-0.02em',
          }"
        >
          Revenue Analytics
        </h2>
      </div>
      <div
        style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between; width: 100%"
      >
        <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center">
          <button
            v-for="preset in analyticsPresets"
            :key="preset.id"
            type="button"
            @click="activeId = preset.id"
            :style="{
              padding: '7px 12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 550,
              background: preset.id === activeId ? chrome.chipActive : chrome.chipIdleBg,
              color: preset.id === activeId ? '#fff' : chrome.chipIdleColor,
            }"
          >
            {{ preset.label }}
          </button>
        </div>
        <button
          type="button"
          @click="exportCsv"
          :style="{
            padding: '7px 12px',
            borderRadius: '6px',
            border: `1px solid ${chrome.border}`,
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 550,
            background: chrome.chipIdleBg,
            color: chrome.chipIdleColor,
          }"
        >
          Export CSV
        </button>
      </div>
    </div>
    <div
      style="flex: 1; min-height: 0; display: flex; flex-direction: column"
    >
      <div style="flex: 1; min-height: 0; height: 100%">
        <SimpleTable
          :key="activeId"
          ref="tableRef"
          :auto-expand-columns="true"
          :column-borders="true"
          :column-reordering="true"
          :column-resizing="true"
          :copy-headers-to-clipboard="true"
          :columns="analyticsDemoConfig.headers"
          :enable-column-editor="true"
          :get-row-id="getRowId"
          height="100%"
          :include-headers-in-csv-export="true"
          :initial-sort-column="isPivoted ? undefined : 'sales'"
          :initial-sort-direction="isPivoted ? undefined : 'desc'"
          :pivot="active.pivot"
          :rows="analyticsDemoConfig.rows"
          :selectable-cells="true"
          :theme="theme"
          :hover-row-background="true"
          :odd-even-row-background="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, GetRowIdParams, SimpleTableExposed } from "@simple-table/vue";
import { analyticsDemoConfig, analyticsPresets } from "./analytics.demo-data";
import type { AnalyticsFactRow } from "./analytics.demo-data";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number | null; theme?: Theme }>(), {
  height: "480px",
});

const activeId = ref(analyticsPresets[0].id);
const tableRef = ref<SimpleTableExposed<AnalyticsFactRow> | null>(null);
const active = computed(
  () => analyticsPresets.find((p) => p.id === activeId.value) ?? analyticsPresets[0]
);
const isPivoted = computed(() => active.value.pivot != null);
const chrome = computed(() => {
  if (props.theme === "modern-black") {
    return {
      border: "#262626",
      chipActive: "#3b82f6",
      chipIdleBg: "#1c1c1c",
      chipIdleColor: "#a3a3a3",
      title: "#fafafa",
    };
  }
  if (props.theme === "modern-dark" || props.theme === "dark") {
    return {
      border: "#374151",
      chipActive: "#3b82f6",
      chipIdleBg: "#1f2937",
      chipIdleColor: "#d1d5db",
      title: "#f9fafb",
    };
  }
  return {
    border: "#e5e5e5",
    chipActive: "#2563eb",
    chipIdleBg: "#f5f5f5",
    chipIdleColor: "#525252",
    title: "#171717",
  };
});
const formatHeight = computed(() => {
  if (props.height == null) return "100%";
  if (typeof props.height === "number") return `${props.height}px`;
  return props.height;
});

function getRowId({ row }: GetRowIdParams<AnalyticsFactRow>) {
  return row.id;
}

function exportCsv() {
  tableRef.value?.getAPI()?.exportToCSV();
}
</script>
