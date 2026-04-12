<template>
  <div>
    <div style="margin-bottom: 12px">
      <button
        @click="addColumn"
        style="background-color: #007bff; color: white; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 13px;"
      >
        + Add Column
      </button>
      <span v-if="lastAdded" style="margin-left: 12px; color: #64748b; font-size: 13px;">
        Added: {{ lastAdded }}
      </span>
    </div>
    <SimpleTable
      :default-headers="headers"
      :rows="columnEditingData"
      :height="height"
      :theme="theme"
      :enable-header-editing="true"
      :selectable-columns="true"
      :on-header-edit="handleHeaderEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, HeaderObject } from "@simple-table/vue";
import { columnEditingData, columnEditingHeaders } from "./column-editing.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const additionalColumns = ref<HeaderObject[]>([]);
const lastAdded = ref("");

const headers = computed(() => [...columnEditingHeaders, ...additionalColumns.value]);

function addColumn() {
  const n = additionalColumns.value.length + 1;
  const col: HeaderObject = {
    accessor: `custom-${n}`,
    label: `Custom ${n}`,
    width: 120,
    type: "string",
  };
  additionalColumns.value = [...additionalColumns.value, col];
  lastAdded.value = col.label;
}

function handleHeaderEdit(_header: HeaderObject, newLabel: string) {
  lastAdded.value = `Renamed to: ${newLabel}`;
}
</script>
