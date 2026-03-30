<template>
  <div>
    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; align-items: center">
      <input
        type="text"
        placeholder="Search..."
        :value="searchText"
        @input="searchText = ($event.target as HTMLInputElement).value"
        style="padding: 6px 12px; border-radius: 6px; border: 1px solid #d1d5db; font-size: 13px; min-width: 200px"
      />
      <button
        @click="filterMode = 'simple'"
        :style="{
          padding: '6px 14px',
          borderRadius: '6px',
          border: filterMode === 'simple' ? '2px solid #3b82f6' : '1px solid #d1d5db',
          background: filterMode === 'simple' ? '#eff6ff' : '#fff',
          color: filterMode === 'simple' ? '#1d4ed8' : '#374151',
          fontWeight: filterMode === 'simple' ? 600 : 400,
          cursor: 'pointer',
          fontSize: '13px',
        }"
      >
        Simple
      </button>
      <button
        @click="filterMode = 'smart'"
        :style="{
          padding: '6px 14px',
          borderRadius: '6px',
          border: filterMode === 'smart' ? '2px solid #3b82f6' : '1px solid #d1d5db',
          background: filterMode === 'smart' ? '#eff6ff' : '#fff',
          color: filterMode === 'smart' ? '#1d4ed8' : '#374151',
          fontWeight: filterMode === 'smart' ? 600 : 400,
          cursor: 'pointer',
          fontSize: '13px',
        }"
      >
        Smart
      </button>
      <button
        @click="caseSensitive = !caseSensitive"
        :style="{
          padding: '6px 14px',
          borderRadius: '6px',
          border: caseSensitive ? '2px solid #3b82f6' : '1px solid #d1d5db',
          background: caseSensitive ? '#eff6ff' : '#fff',
          color: caseSensitive ? '#1d4ed8' : '#374151',
          fontWeight: caseSensitive ? 600 : 400,
          cursor: 'pointer',
          fontSize: '13px',
        }"
      >
        Case Sensitive
      </button>
    </div>
    <SimpleTable
      :default-headers="quickFilterConfig.headers"
      :rows="quickFilterConfig.rows"
      :height="height"
      :theme="theme"
      :quick-filter="{ text: searchText, mode: filterMode, caseSensitive }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import type { QuickFilterMode } from "simple-table-core";
import { quickFilterConfig } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const searchText = ref("");
const filterMode = ref<QuickFilterMode>("simple");
const caseSensitive = ref(false);
</script>
