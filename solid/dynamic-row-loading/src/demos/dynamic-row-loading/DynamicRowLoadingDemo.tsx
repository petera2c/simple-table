import { createSignal } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme, OnRowGroupExpandProps } from "@simple-table/solid";
import {
  dynamicRowLoadingConfig,
  generateInitialRegions,
  fetchStoresForRegion,
  fetchProductsForStore,
} from "./dynamic-row-loading.demo-data";
import type { DynamicRegion, DynamicTreeRow } from "./dynamic-row-loading.demo-data";
import "@simple-table/solid/styles.css";

export default function DynamicRowLoadingDemo(props: { height?: string | number; theme?: Theme }) {
  const [rows, setRows] = createSignal<DynamicRegion[]>(generateInitialRegions());

  const handleRowExpand = async ({
    row,
    depth,
    groupingKey,
    isExpanded,
    setLoading,
    setError,
    setEmpty,
    rowIndexPath,
  }: OnRowGroupExpandProps<DynamicTreeRow>) => {
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
        setRows((prev) => {
          const newRows = [...prev];
          newRows[rowIndexPath[0]].stores = stores;
          return newRows;
        });
      } else if (depth === 1 && groupingKey === "products" && row.type === "store") {
        setLoading(true);
        const products = await fetchProductsForStore(row.id);
        setLoading(false);
        if (products.length === 0) {
          setEmpty(true, "No products found for this store");
          return;
        }
        setRows((prev) => {
          const newRows = [...prev];
          const region = newRows[rowIndexPath[0]];
          if (region.stores && region.stores[rowIndexPath[1]]) {
            region.stores[rowIndexPath[1]].products = products;
          }
          return newRows;
        });
      }
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : "Failed to load data");
    }
  };

  return (
    <SimpleTable
      columnResizing={dynamicRowLoadingConfig.tableProps.columnResizing}
      columns={dynamicRowLoadingConfig.headers}
      enableColumnEditor={dynamicRowLoadingConfig.tableProps.enableColumnEditor}
      expandAll={dynamicRowLoadingConfig.tableProps.expandAll}
      height={props.height ?? "400px"}
      onRowGroupExpand={handleRowExpand}
      rowGrouping={dynamicRowLoadingConfig.tableProps.rowGrouping}
      getRowId={({ row }) => row.id}
      rows={rows()}
      selectableCells={dynamicRowLoadingConfig.tableProps.selectableCells}
      theme={props.theme}
      oddEvenRowBackground={dynamicRowLoadingConfig.tableProps.oddEvenRowBackground}
    />
  );
}
