<template>
  <SimpleTable
    :columns="columnSortingConfig.headers"
    :rows="columnSortingConfig.rows"
    :get-row-id="getRowId"
    :height="height"
    :theme="theme"
    initial-sort-column="age"
    initial-sort-direction="desc"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme, GetRowIdParams } from "@simple-table/vue";
import { columnSortingConfig } from "./column-sorting.demo-data";
import type { FacultyMember } from "./column-sorting.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const getRowId = ({ row }: GetRowIdParams<FacultyMember>) => row.id;
</script>
