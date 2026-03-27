import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, OnRowGroupExpandProps } from "simple-table-core";
import {
  dynamicRowLoadingConfig,
  generateInitialRegions,
  fetchStoresForRegion,
  fetchProductsForStore,
} from "@simple-table/examples-shared";
import type { DynamicRegion, DynamicStore } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderDynamicRowLoadingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
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
        rows[rowIndexPath[0]].stores = stores;
        table.updateConfig({ rows: [...rows] });
      } else if (depth === 1 && groupingKey === "products") {
        setLoading(true);
        const products = await fetchProductsForStore((row as DynamicStore).id);
        setLoading(false);
        if (products.length === 0) {
          setEmpty(true, "No products found");
          return;
        }
        const region = rows[rowIndexPath[0]];
        if (region.stores && region.stores[rowIndexPath[1]]) {
          region.stores[rowIndexPath[1]].products = products;
        }
        table.updateConfig({ rows: [...rows] });
      }
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : "Failed to load data");
    }
  };

  const table = new SimpleTableVanilla(container, {
    columnResizing: dynamicRowLoadingConfig.tableProps.columnResizing,
    defaultHeaders: dynamicRowLoadingConfig.headers,
    editColumns: dynamicRowLoadingConfig.tableProps.editColumns,
    expandAll: dynamicRowLoadingConfig.tableProps.expandAll,
    height: options?.height ?? "400px",
    onRowGroupExpand: handleRowExpand,
    rowGrouping: dynamicRowLoadingConfig.tableProps.rowGrouping,
    getRowId: dynamicRowLoadingConfig.tableProps.getRowId,
    rows: rows,
    selectableCells: dynamicRowLoadingConfig.tableProps.selectableCells,
    theme: options?.theme,
    useOddEvenRowBackground: dynamicRowLoadingConfig.tableProps.useOddEvenRowBackground,
  });

  return table;
}
