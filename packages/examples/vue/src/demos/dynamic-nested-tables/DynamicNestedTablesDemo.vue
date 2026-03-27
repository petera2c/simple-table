<template>
  <SimpleTable
    :auto-expand-columns="dynamicNestedTablesConfig.tableProps.autoExpandColumns"
    :default-headers="dynamicNestedTablesConfig.headers"
    :expand-all="dynamicNestedTablesConfig.tableProps.expandAll"
    :height="height"
    :row-grouping="dynamicNestedTablesConfig.tableProps.rowGrouping"
    :get-row-id="dynamicNestedTablesConfig.tableProps.getRowId"
    :rows="rows"
    :on-row-group-expand="handleCompanyExpand"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme } from "@simple-table/vue";
import type { OnRowGroupExpandProps } from "simple-table-core";
import {
  dynamicNestedTablesConfig,
  dynamicNestedTablesData,
  fetchDivisionsForCompany,
} from "@simple-table/examples-shared";
import type { DynamicCompany } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), { height: "500px" });

const rows = ref<DynamicCompany[]>([...dynamicNestedTablesData]);

async function handleCompanyExpand({
  row,
  groupingKey,
  isExpanded,
  rowIndexPath,
  setLoading,
  setError,
  setEmpty,
}: OnRowGroupExpandProps) {
  if (!isExpanded) return;
  try {
    if (groupingKey === "divisions") {
      const company = row as DynamicCompany;
      if (company.divisions && company.divisions.length > 0) return;
      setLoading(true);
      const divisions = await fetchDivisionsForCompany(company.id);
      if (divisions.length === 0) {
        setEmpty(true, "No divisions found");
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
