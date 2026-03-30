<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, OnRowGroupExpandProps } from "@simple-table/svelte";
  import {
    dynamicRowLoadingConfig,
    generateInitialRegions,
    fetchStoresForRegion,
    fetchProductsForStore,
  } from "@simple-table/examples-shared";
  import type { DynamicRegion, DynamicStore } from "@simple-table/examples-shared";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let rows = $state<DynamicRegion[]>(generateInitialRegions());

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
        const newRows = [...rows];
        newRows[rowIndexPath[0]].stores = stores;
        rows = newRows;
      } else if (depth === 1 && groupingKey === "products") {
        setLoading(true);
        const products = await fetchProductsForStore((row as DynamicStore).id);
        setLoading(false);
        if (products.length === 0) {
          setEmpty(true, "No products found");
          return;
        }
        const newRows = [...rows];
        const region = newRows[rowIndexPath[0]];
        if (region.stores && region.stores[rowIndexPath[1]]) {
          region.stores[rowIndexPath[1]].products = products;
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
  defaultHeaders={dynamicRowLoadingConfig.headers}
  editColumns={dynamicRowLoadingConfig.tableProps.editColumns}
  expandAll={dynamicRowLoadingConfig.tableProps.expandAll}
  {height}
  onRowGroupExpand={handleRowExpand}
  rowGrouping={dynamicRowLoadingConfig.tableProps.rowGrouping}
  getRowId={dynamicRowLoadingConfig.tableProps.getRowId}
  rows={rows}
  selectableCells={dynamicRowLoadingConfig.tableProps.selectableCells}
  {theme}
  useOddEvenRowBackground={dynamicRowLoadingConfig.tableProps.useOddEvenRowBackground}
/>
