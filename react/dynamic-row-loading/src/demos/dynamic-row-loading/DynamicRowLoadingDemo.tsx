import { useState, useCallback } from "react";
import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme, OnRowGroupExpandProps } from "@simple-table/react";
import {
  dynamicRowLoadingConfig,
  generateInitialRegions,
  fetchStoresForRegion,
  fetchProductsForStore,
} from "./dynamic-row-loading.demo-data";
import type { DynamicRegion, DynamicStore } from "./dynamic-row-loading.demo-data";
import "@simple-table/react/styles.css";

const DynamicRowLoadingDemo = ({ height = "400px", theme }: { height?: string | number; theme?: Theme }) => {
  const [rows, setRows] = useState<DynamicRegion[]>(() => generateInitialRegions());

  const handleRowExpand = useCallback(
    async ({ row, depth, groupingKey, isExpanded, setLoading, setError, setEmpty, rowIndexPath }: OnRowGroupExpandProps) => {
      if (!isExpanded) return;
      if (groupingKey && row[groupingKey] && (row[groupingKey] as unknown[]).length > 0) return;

      try {
        if (depth === 0 && groupingKey === "stores") {
          setLoading(true);
          const region = row as DynamicRegion;
          const stores = await fetchStoresForRegion(region.id);
          setLoading(false);
          if (stores.length === 0) { setEmpty(true, "No stores found for this region"); return; }
          setRows((prevRows) => {
            const newRows = [...prevRows];
            newRows[rowIndexPath[0]].stores = stores;
            return newRows;
          });
        } else if (depth === 1 && groupingKey === "products") {
          setLoading(true);
          const store = row as DynamicStore;
          const products = await fetchProductsForStore(store.id);
          setLoading(false);
          if (products.length === 0) { setEmpty(true, "No products found for this store"); return; }
          setRows((prevRows) => {
            const newRows = [...prevRows];
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
    },
    [],
  );

  return (
    <SimpleTable
      columnResizing={dynamicRowLoadingConfig.tableProps.columnResizing}
      defaultHeaders={defaultHeadersFromCore(dynamicRowLoadingConfig.headers)}
      editColumns={dynamicRowLoadingConfig.tableProps.editColumns}
      expandAll={dynamicRowLoadingConfig.tableProps.expandAll}
      height={height}
      onRowGroupExpand={handleRowExpand}
      rowGrouping={dynamicRowLoadingConfig.tableProps.rowGrouping}
      getRowId={dynamicRowLoadingConfig.tableProps.getRowId}
      rows={rows}
      selectableCells={dynamicRowLoadingConfig.tableProps.selectableCells}
      theme={theme}
      useOddEvenRowBackground={dynamicRowLoadingConfig.tableProps.useOddEvenRowBackground}
    />
  );
};

export default DynamicRowLoadingDemo;
