<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { customIconsConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const icons = {
  sortUp: "▲",
  sortDown: "▼",
  filter: "⊞",
  expand: "▶",
  next: "→",
  prev: "←",
};
</script>

<template>
  <SimpleTable
    :default-headers="customIconsConfig.headers"
    :rows="customIconsConfig.rows"
    :icons="icons"
    :height="height"
    :theme="theme"
  />
</template>
