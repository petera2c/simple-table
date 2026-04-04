<template>
  <div>
    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px">
      <button
        v-for="t in AVAILABLE_THEMES"
        :key="t.value"
        @click="selectedTheme = t.value"
        :style="{
          padding: '6px 14px',
          borderRadius: '6px',
          border: selectedTheme === t.value ? '2px solid #3b82f6' : '1px solid #d1d5db',
          background: selectedTheme === t.value ? '#eff6ff' : '#fff',
          color: selectedTheme === t.value ? '#1d4ed8' : '#374151',
          fontWeight: selectedTheme === t.value ? 600 : 400,
          cursor: 'pointer',
          fontSize: '13px',
        }"
      >
        {{ t.label }}
      </button>
    </div>
    <SimpleTable
      :default-headers="defaultHeadersFromCore(themesConfig.headers)"
      :rows="themesConfig.rows"
      :height="height"
      :theme="selectedTheme"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { themesConfig, AVAILABLE_THEMES } from "./themes.demo-data";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const selectedTheme = ref<Theme>(props.theme ?? "light");
</script>
