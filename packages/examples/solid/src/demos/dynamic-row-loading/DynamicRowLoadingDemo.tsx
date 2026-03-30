import { createSignal } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import type { OnRowGroupExpandProps } from "simple-table-core";
import {
  dynamicRowLoadingConfig,
  generateInitialRegions,
  fetchStoresForRegion,
  fetchProductsForStore,
} from "@simple-table/examples-shared";
import type { DynamicRegion, DynamicStore } from "@simple-table/examples-shared";
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
  }: OnRowGroupExpandProps) => {
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
        setRows((prev) => {
          const newRows = [...prev];
          newRows[rowIndexPath[0]].stores = stores;
          return newRows;
        });
      } else if (depth === 1 && groupingKey === "products") {
        setLoading(true);
        const products = await fetchProductsForStore((row as DynamicStore).id);
        setLoading(false);
        if (products.length === 0) {
          setEmpty(true, "No products found");
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
      defaultHeaders={dynamicRowLoadingConfig.headers}
      editColumns={dynamicRowLoadingConfig.tableProps.editColumns}
      expandAll={dynamicRowLoadingConfig.tableProps.expandAll}
      height={props.height ?? "400px"}
      onRowGroupExpand={handleRowExpand}
      rowGrouping={dynamicRowLoadingConfig.tableProps.rowGrouping}
      getRowId={dynamicRowLoadingConfig.tableProps.getRowId}
      rows={rows()}
      selectableCells={dynamicRowLoadingConfig.tableProps.selectableCells}
      theme={props.theme}
      useOddEvenRowBackground={dynamicRowLoadingConfig.tableProps.useOddEvenRowBackground}
    />
  );
}
