<template>
  <SimpleTable
    :column-resizing="dynamicRowLoadingConfig.tableProps.columnResizing"
    :columns="dynamicRowLoadingConfig.headers"
    :enable-column-editor="dynamicRowLoadingConfig.tableProps.enableColumnEditor"
    :expand-all="dynamicRowLoadingConfig.tableProps.expandAll"
    :height="height"
    :on-row-group-expand="handleRowExpand"
    :row-grouping="dynamicRowLoadingConfig.tableProps.rowGrouping"
    :get-row-id="getRowId"
    :rows="rows"
    :selectable-cells="dynamicRowLoadingConfig.tableProps.selectableCells"
    :theme="theme"
    :odd-even-row-background="dynamicRowLoadingConfig.tableProps.oddEvenRowBackground"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, OnRowGroupExpandProps, GetRowIdParams } from "@simple-table/vue";
import {
  dynamicRowLoadingConfig,
  generateInitialRegions,
  fetchStoresForRegion,
  fetchProductsForStore,
} from "./dynamic-row-loading.demo-data";
import type { DynamicRegion, DynamicTreeRow } from "./dynamic-row-loading.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), { height: "400px" });

const rows = ref<DynamicRegion[]>(generateInitialRegions());

const getRowId = ({ row }: GetRowIdParams<DynamicTreeRow>) => row.id;

async function handleRowExpand({
  row,
  depth,
  groupingKey,
  isExpanded,
  setLoading,
  setError,
  setEmpty,
  rowIndexPath,
}: OnRowGroupExpandProps<DynamicTreeRow>) {
  if (!isExpanded) return;
  if (groupingKey && row[groupingKey as keyof DynamicTreeRow] != null) {
    const nested = row[groupingKey as keyof DynamicTreeRow];
    if (Array.isArray(nested) && nested.length > 0) return;
  }

  try {
    if (depth === 0 && groupingKey === "stores" && row.type === "region") {
      setLoading(true);
      const stores = await fetchStoresForRegion(row.id);
      setLoading(false);
      if (stores.length === 0) {
        setEmpty(true, "No stores found for this region");
        return;
      }
      const newRows = [...rows.value];
      newRows[rowIndexPath[0]].stores = stores;
      rows.value = newRows;
    } else if (depth === 1 && groupingKey === "products" && row.type === "store") {
      setLoading(true);
      const products = await fetchProductsForStore(row.id);
      setLoading(false);
      if (products.length === 0) {
        setEmpty(true, "No products found for this store");
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
