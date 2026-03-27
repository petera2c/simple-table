<template>
  <SimpleTable
    :default-headers="cellEditingConfig.headers"
    :rows="data"
    :height="height"
    :theme="theme"
    @cell-edit="handleCellEdit"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import type { CellChangeProps } from "simple-table-core";
import { cellEditingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

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
