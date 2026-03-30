<template>
  <SimpleTable
    :default-headers="singleRowChildrenConfig.headers"
    :rows="singleRowChildrenConfig.rows"
    :column-resizing="singleRowChildrenConfig.tableProps.columnResizing"
    :selectable-cells="singleRowChildrenConfig.tableProps.selectableCells"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { singleRowChildrenConfig } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), { height: "400px" });
</script>
