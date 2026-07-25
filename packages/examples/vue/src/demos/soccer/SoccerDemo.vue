<template>
  <SimpleTable
    :columns="soccerConfig.headers"
    :rows="soccerConfig.rows"
    :height="height"
    :theme="theme"
    column-reordering
    column-resizing
    enable-column-editor
    selectable-cells
    initial-sort-column="rating"
    initial-sort-direction="desc"
    :custom-theme="{ headerHeight: 40, rowHeight: 48 }"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import { soccerConfig } from "./soccer.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), { height: "70dvh" });
</script>
