<template>
  <SimpleTable
    :columns="singleRowChildrenConfig.headers"
    :rows="singleRowChildrenConfig.rows"
    :get-row-id="getRowId"
    :column-resizing="singleRowChildrenConfig.tableProps.columnResizing"
    :selectable-cells="singleRowChildrenConfig.tableProps.selectableCells"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { SimpleTable } from "@simple-table/vue";
import type { Theme, GetRowIdParams } from "@simple-table/vue";
import { singleRowChildrenConfig } from "./single-row-children.demo-data";
import type { StudentRecord } from "./single-row-children.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), { height: "400px" });

const getRowId = ({ row }: GetRowIdParams<StudentRecord>) => row.id;
</script>
