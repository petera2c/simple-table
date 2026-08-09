<template>
  <div>
    <label
      style="
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-size: 14px;
        color: #374151;
      "
    >
      <input
        type="checkbox"
        :checked="pivotEnabled"
        aria-label="Pivot mode"
        @change="onPivotEnabledChange(($event.target as HTMLInputElement).checked)"
      />
      Pivot mode
    </label>
    <SimpleTable
      :columns="pivotDemoConfig.headers"
      :rows="pivotDemoConfig.rows"
      :pivot="pivotEnabled ? pivot : null"
      :onPivotChange="(next) => (pivot = next)"
      :auto-expand-columns="true"
      :column-resizing="true"
      :enable-column-editor="true"
      :enable-column-editor-init-open="true"
      :enable-pivot-panel="pivotEnabled"
      :height="height"
      :selectable-cells="true"
      :theme="theme"
      :get-row-id="getRowId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { GetRowIdParams, PivotConfig, Theme } from "@simple-table/vue";
import { pivotDemoConfig } from "./pivot.demo-data";
import type { PivotFact } from "./pivot.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "500px",
});

const INITIAL_PIVOT: PivotConfig = {
  rows: ["region", "product"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
};

const pivotEnabled = ref(true);
const pivot = ref<PivotConfig | null>(INITIAL_PIVOT);

const onPivotEnabledChange = (enabled: boolean) => {
  pivotEnabled.value = enabled;
  if (enabled && pivot.value === null) {
    pivot.value = INITIAL_PIVOT;
  }
};

const getRowId = ({ row }: GetRowIdParams<PivotFact>) =>
  row?.id == null ? undefined : String(row.id);
</script>
