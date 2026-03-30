<template>
  <SimpleTable
    :column-resizing="dynamicRowLoadingConfig.tableProps.columnResizing"
    :default-headers="dynamicRowLoadingConfig.headers"
    :edit-columns="dynamicRowLoadingConfig.tableProps.editColumns"
    :expand-all="dynamicRowLoadingConfig.tableProps.expandAll"
    :height="height"
    :on-row-group-expand="handleRowExpand"
    :row-grouping="dynamicRowLoadingConfig.tableProps.rowGrouping"
    :get-row-id="dynamicRowLoadingConfig.tableProps.getRowId"
    :rows="rows"
    :selectable-cells="dynamicRowLoadingConfig.tableProps.selectableCells"
    :theme="theme"
    :use-odd-even-row-background="dynamicRowLoadingConfig.tableProps.useOddEvenRowBackground"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, OnRowGroupExpandProps } from "@simple-table/vue";
import {
  dynamicRowLoadingConfig,
  generateInitialRegions,
  fetchStoresForRegion,
  fetchProductsForStore,
} from "@simple-table/examples-shared";
import type { DynamicRegion, DynamicStore } from "@simple-table/examples-shared";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), { height: "400px" });

const rows = ref<DynamicRegion[]>(generateInitialRegions());

async function handleRowExpand({
  row,
  depth,
  groupingKey,
  isExpanded,
  setLoading,
  setError,
  setEmpty,
  rowIndexPath,
}: OnRowGroupExpandProps) {
  if (!isExpanded) return;
  if (groupingKey && row[groupingKey] && (row[groupingKey] as unknown[]).length > 0) return;

  try {
    if (depth === 0 && groupingKey === "stores") {
      setLoading(true);
      const stores = await fetchStoresForRegion((row as DynamicRegion).id);
      setLoading(false);
      if (stores.length === 0) {
        setEmpty(true, "No stores found");
        return;
      }
      const newRows = [...rows.value];
      newRows[rowIndexPath[0]].stores = stores;
      rows.value = newRows;
    } else if (depth === 1 && groupingKey === "products") {
      setLoading(true);
      const products = await fetchProductsForStore((row as DynamicStore).id);
      setLoading(false);
      if (products.length === 0) {
        setEmpty(true, "No products found");
        return;
      }
      const newRows = [...rows.value];
      const region = newRows[rowIndexPath[0]];
      if (region.stores && region.stores[rowIndexPath[1]]) {
        region.stores[rowIndexPath[1]].products = products;
      }
      rows.value = newRows;
    }
  } catch (error) {
    setLoading(false);
    setError(error instanceof Error ? error.message : "Failed to load data");
  }
}
</script>
