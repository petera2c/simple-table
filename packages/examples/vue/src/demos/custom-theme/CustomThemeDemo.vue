<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { customThemeConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";
import "../../../../shared/src/styles/custom-theme.css";

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>

<template>
  <SimpleTable
    :default-headers="customThemeConfig.headers"
    :rows="customThemeConfig.rows"
    :theme="props.theme ?? 'custom'"
    :custom-theme="customThemeConfig.tableProps.customTheme"
    :column-resizing="true"
    :selectable-cells="true"
    :height="props.height"
  />
</template>
