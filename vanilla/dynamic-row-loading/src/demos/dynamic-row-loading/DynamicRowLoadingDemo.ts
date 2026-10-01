import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, OnRowGroupExpandProps, GetRowIdParams } from "simple-table-core";
import {
  dynamicRowLoadingConfig,
  generateInitialRegions,
  fetchStoresForRegion,
  fetchProductsForStore,
} from "./dynamic-row-loading.demo-data";
import type { DynamicRegion, DynamicTreeRow } from "./dynamic-row-loading.demo-data";
import "simple-table-core/styles.css";

const getRowId = ({ row }: GetRowIdParams<DynamicTreeRow>) => row.id;

export function renderDynamicRowLoadingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla<DynamicTreeRow> {
  let rows: DynamicRegion[] = generateInitialRegions();

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
          setEmpty(true, "No stores found for this region");
          return;
        }
        rows[rowIndexPath[0]].stores = stores;
        table.update({ rows: [...rows] });
      } else if (depth === 1 && groupingKey === "products" && row.type === "store") {
        setLoading(true);
        const products = await fetchProductsForStore(row.id);
        setLoading(false);
        if (products.length === 0) {
          setEmpty(true, "No products found for this store");
          return;
        }
        const region = rows[rowIndexPath[0]];
        if (region.stores && region.stores[rowIndexPath[1]]) {
          region.stores[rowIndexPath[1]].products = products;
        }
        table.update({ rows: [...rows] });
      }
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : "Failed to load data");
    }
  };

  const table = new SimpleTableVanilla<DynamicTreeRow>(container, {
    columnResizing: dynamicRowLoadingConfig.tableProps.columnResizing,
    columns: dynamicRowLoadingConfig.headers,
    enableColumnEditor: dynamicRowLoadingConfig.tableProps.enableColumnEditor,
    expandAll: dynamicRowLoadingConfig.tableProps.expandAll,
    height: options?.height ?? "400px",
    onRowGroupExpand: handleRowExpand,
    rowGrouping: dynamicRowLoadingConfig.tableProps.rowGrouping,
    getRowId,
    rows,
    selectableCells: dynamicRowLoadingConfig.tableProps.selectableCells,
    theme: options?.theme,
    oddEvenRowBackground: dynamicRowLoadingConfig.tableProps.oddEvenRowBackground,
  });

  return table;
}
