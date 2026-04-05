<template>
  <SimpleTable
    :default-headers="defaultHeadersFromCore(cellEditingConfig.headers)"
    :rows="data"
    :height="height"
    :theme="theme"
    @cell-edit="handleCellEdit"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme, CellChangeProps } from "@simple-table/vue";
import { cellEditingConfig } from "./cell-editing.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), {
  height: "400px",
});

const data = ref([...cellEditingConfig.rows]);

const handleCellEdit = ({ accessor, newValue, row }: CellChangeProps) => {
  data.value = data.value.map((item) =>
    item.id === row.id ? { ...item, [accessor]: newValue } : item
  );
};
</script>
