<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { columnEditorCustomRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});
</script>

<template>
  <SimpleTable
    :default-headers="columnEditorCustomRendererConfig.headers"
    :rows="columnEditorCustomRendererConfig.rows"
    :edit-columns="true"
    :height="height"
    :theme="theme"
  />
</template>
