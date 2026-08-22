<template>
  <SimpleTable
    :column-reordering="animationsConfig.tableProps.columnReordering"
    :columns="headers"
    :enable-column-editor="animationsConfig.tableProps.enableColumnEditor"
    :enable-column-editor-init-open="animationsConfig.tableProps.enableColumnEditorInitOpen"
    :rows="animationsConfig.rows"
    :get-row-id="getRowId"
    :height="height"
    :theme="theme"
    @column-order-change="handleColumnOrderChange"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, VueColumnDef, GetRowIdParams } from "@simple-table/vue";
import { animationsConfig } from "./animations.demo-data";
import type { AnimationsCrewMember } from "./animations.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const headers = ref<VueColumnDef<AnimationsCrewMember>[]>([...animationsConfig.headers]);

const handleColumnOrderChange = (newHeaders: VueColumnDef<AnimationsCrewMember>[]) => {
  headers.value = newHeaders;
};

const getRowId = ({ row }: GetRowIdParams<AnimationsCrewMember>) => row.id;
</script>
