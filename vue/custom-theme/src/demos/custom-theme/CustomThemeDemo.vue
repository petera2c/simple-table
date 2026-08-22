<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme, GetRowIdParams } from "@simple-table/vue";
import { customThemeConfig } from "./custom-theme.demo-data";
import type { ThemeContact } from "./custom-theme.demo-data";
import "@simple-table/vue/styles.css";
import "./custom-theme.css";

const getRowId = ({ row }: GetRowIdParams<ThemeContact>) => row.id;

const props = withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>

<template>
  <SimpleTable
    :columns="customThemeConfig.headers"
    :rows="customThemeConfig.rows"
    :get-row-id="getRowId"
    :theme="props.theme ?? 'custom'"
    :custom-theme="customThemeConfig.tableProps.customTheme"
    :column-resizing="true"
    :selectable-cells="true"
    :height="props.height"
  />
</template>
