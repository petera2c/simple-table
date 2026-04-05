<script setup lang="ts">
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { emptyStateConfig, buildEmptyStateElement } from "./empty-state.demo-data";
import "@simple-table/vue/styles.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const emptyState = buildEmptyStateElement();
</script>

<template>
  <SimpleTable
    :default-headers="defaultHeadersFromCore(emptyStateConfig.headers)"
    :rows="emptyStateConfig.rows"
    :table-empty-state-renderer="emptyState"
    :height="props.height"
    :theme="props.theme"
  />
</template>
