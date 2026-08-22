<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, OnRowGroupExpandProps, GetRowIdParams } from "@simple-table/svelte";
  import {
    dynamicRowLoadingConfig,
    generateInitialRegions,
    fetchStoresForRegion,
    fetchProductsForStore,
  } from "./dynamic-row-loading.demo-data";
  import type { DynamicRegion, DynamicTreeRow } from "./dynamic-row-loading.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let rows = $state<DynamicRegion[]>(generateInitialRegions());
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
    if (groupingKey === "stores" && row.type === "region" && row.stores && row.stores.length > 0) {
      return;
    }
    if (groupingKey === "products" && row.type === "store" && row.products && row.products.length > 0) {
      return;
    }

    try {
      if (depth === 0 && groupingKey === "stores" && row.type === "region") {
        setLoading(true);
        const stores = await fetchStoresForRegion(row.id);
        setLoading(false);
        if (stores.length === 0) {
          setEmpty(true, "No stores found");
          return;
        }
        const newRows = [...rows];
        newRows[rowIndexPath[0]] = { ...newRows[rowIndexPath[0]], stores };
        rows = newRows;
      } else if (depth === 1 && groupingKey === "products" && row.type === "store") {
        setLoading(true);
        const products = await fetchProductsForStore(row.id);
        setLoading(false);
        if (products.length === 0) {
          setEmpty(true, "No products found");
          return;
        }
        const newRows = [...rows];
        const region = newRows[rowIndexPath[0]];
        if (region.stores && region.stores[rowIndexPath[1]]) {
          region.stores[rowIndexPath[1]] = { ...region.stores[rowIndexPath[1]], products };
        }
        rows = newRows;
      }
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : "Failed to load data");
    }
  }
</script>

<SimpleTable
  columnResizing={dynamicRowLoadingConfig.tableProps.columnResizing}
  columns={dynamicRowLoadingConfig.headers}
  enableColumnEditor={dynamicRowLoadingConfig.tableProps.enableColumnEditor}
  expandAll={dynamicRowLoadingConfig.tableProps.expandAll}
  {getRowId}
  {height}
  onRowGroupExpand={handleRowExpand}
  rowGrouping={dynamicRowLoadingConfig.tableProps.rowGrouping}
  rows={rows}
  selectableCells={dynamicRowLoadingConfig.tableProps.selectableCells}
  {theme}
  oddEvenRowBackground={dynamicRowLoadingConfig.tableProps.oddEvenRowBackground}
/>
