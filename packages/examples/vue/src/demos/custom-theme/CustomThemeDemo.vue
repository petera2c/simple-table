<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { customThemeConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const customThemeOverrides = {
  rowHeight: 40,
  headerHeight: 44,
  fontSize: 13,
};
</script>

<template>
  <SimpleTable
    :default-headers="customThemeConfig.headers"
    :rows="customThemeConfig.rows"
    theme="custom"
    :custom-theme="customThemeOverrides"
    :height="height"
  />
</template>
