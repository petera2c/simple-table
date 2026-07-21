<template>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 100%">
    <div style="display: flex; flex-wrap: wrap; gap: 8px">
      <button
        v-for="preset in pivotPresets"
        :key="preset.id"
        type="button"
        @click="activeId = preset.id"
        :style="{
          padding: '6px 12px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 500,
          background: preset.id === activeId ? '#2563eb' : '#e5e7eb',
          color: preset.id === activeId ? '#fff' : '#374151',
        }"
      >
        {{ preset.label }}
      </button>
    </div>
    <SimpleTable
      :columns="pivotDemoConfig.headers"
      :rows="pivotDemoConfig.rows"
      :pivot="active.pivot"
      :column-resizing="true"
      :expand-all="nestedRows"
      :height="height"
      :selectable-cells="true"
      :theme="theme"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { pivotDemoConfig, pivotPresets } from "./pivot.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const activeId = ref(pivotPresets[0].id);
const active = computed(
  () => pivotPresets.find((p) => p.id === activeId.value) ?? pivotPresets[0]
);
const nestedRows = computed(() => active.value.pivot.rows.length > 1);
</script>
