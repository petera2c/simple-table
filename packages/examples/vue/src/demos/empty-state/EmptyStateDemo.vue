<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { emptyStateConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

function createEmptyState() {
  const el = document.createElement("div");
  el.style.cssText = "display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px;color:#888;";
  el.innerHTML = '<div style="font-size:32px;margin-bottom:8px;">∅</div><div>No data available</div>';
  return el;
}

const emptyState = createEmptyState();
</script>

<template>
  <SimpleTable
    :default-headers="emptyStateConfig.headers"
    :rows="emptyStateConfig.rows"
    :table-empty-state-renderer="emptyState"
    :height="height"
    :theme="theme"
  />
</template>
