<template>
  <SimpleTable
    :columns="cellEditingConfig.headers"
    :rows="data"
    :get-row-id="getRowId"
    :height="height"
    :theme="theme"
    @cell-edit="handleCellEdit"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, CellChangeProps, GetRowIdParams } from "@simple-table/vue";
import { cellEditingConfig } from "./cell-editing.demo-data";
import type { CellEditingEmployee } from "./cell-editing.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const getRowId = ({ row }: GetRowIdParams<CellEditingEmployee>) => row.id;

const data = ref<CellEditingEmployee[]>([...cellEditingConfig.rows]);

const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps<CellEditingEmployee>) => {
  data.value = data.value.map((item) =>
    item.id === row.id ? { ...item, [accessor]: newValue } : item
  );
};
</script>
