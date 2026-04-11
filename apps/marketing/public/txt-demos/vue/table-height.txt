<template>
  <div>
    <div style="display: flex; gap: 8px; margin-bottom: 12px">
      <button
        v-for="h in heights"
        :key="h"
        @click="selectedHeight = h"
        :style="{
          padding: '6px 12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: selectedHeight === h ? '#3b82f6' : '#f3f4f6',
          color: selectedHeight === h ? '#fff' : '#374151',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
        }"
      >
        {{ h }}
      </button>
    </div>
    <SimpleTable
      :default-headers="tableHeightConfig.headers"
      :rows="tableHeightConfig.rows"
      :height="selectedHeight"
      :theme="theme"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { tableHeightConfig } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const heights = ["200px", "300px", "400px"];
const selectedHeight = ref("400px");
</script>
