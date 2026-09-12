<template>
  <SimpleTable
    :auto-expand-columns="true"
    :columns="soccerConfig.headers"
    :rows="soccerConfig.rows"
    :get-row-id="getRowId"
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
import type { Theme, GetRowIdParams } from "@simple-table/vue";
import { soccerConfig } from "./soccer.demo-data";
import type { SoccerPlayer } from "./soccer.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), { height: "70dvh" });

const getRowId = ({ row }: GetRowIdParams<SoccerPlayer>) => row.id;
</script>
