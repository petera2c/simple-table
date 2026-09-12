<template>
  <SimpleTable
    :auto-expand-columns="dynamicNestedTablesConfig.tableProps.autoExpandColumns"
    :columns="dynamicNestedTablesConfig.headers"
    :expand-all="dynamicNestedTablesConfig.tableProps.expandAll"
    :height="height"
    :row-grouping="dynamicNestedTablesConfig.tableProps.rowGrouping"
    :get-row-id="getRowId"
    :rows="rows"
    :on-row-group-expand="handleCompanyExpand"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, OnRowGroupExpandProps, GetRowIdParams } from "@simple-table/vue";
import {
  dynamicNestedTablesConfig,
  dynamicNestedTablesData,
  fetchDivisionsForCompany,
} from "./dynamic-nested-tables.demo-data";
import type { DynamicCompany } from "./dynamic-nested-tables.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), { height: "500px" });

const rows = ref<DynamicCompany[]>([...dynamicNestedTablesData]);

const getRowId = ({ row }: GetRowIdParams<DynamicCompany>) => row.id;

async function handleCompanyExpand({
  row,
  groupingKey,
  isExpanded,
  rowIndexPath,
  setLoading,
  setError,
  setEmpty,
}: OnRowGroupExpandProps<DynamicCompany>) {
  if (!isExpanded) return;
  try {
    if (groupingKey === "divisions") {
      if (row.divisions && row.divisions.length > 0) return;
      setLoading(true);
      const divisions = await fetchDivisionsForCompany(row.id);
      if (divisions.length === 0) {
        setEmpty(true, "No divisions found for this company");
        return;
      }
      const newRows = [...rows.value];
      newRows[rowIndexPath[0]] = { ...newRows[rowIndexPath[0]], divisions };
      rows.value = newRows;
    }
  } catch (error) {
    setLoading(false);
    setError(error instanceof Error ? error.message : "Failed to load divisions");
  }
}
</script>
