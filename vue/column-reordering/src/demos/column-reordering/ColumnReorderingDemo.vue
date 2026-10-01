<template>
  <SimpleTable
    :column-reordering="true"
    :columns="headers"
    :rows="columnReorderingConfig.rows"
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
import { columnReorderingConfig } from "./column-reordering.demo-data";
import type { CrewMember } from "./column-reordering.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const headers = ref<VueColumnDef<CrewMember>[]>([...columnReorderingConfig.headers]);

const handleColumnOrderChange = (newHeaders: VueColumnDef<CrewMember>[]) => {
  headers.value = newHeaders;
};

const getRowId = ({ row }: GetRowIdParams<CrewMember>) => row.id;
</script>
