import { Component, Input } from "@angular/core";
import {SimpleTableComponent, defaultHeadersFromCore} from "@simple-table/angular";
import type { AngularHeaderObject, OnRowGroupExpandProps, Theme } from "@simple-table/angular";
import {
  dynamicRowLoadingConfig,
  generateInitialRegions,
  fetchStoresForRegion,
  fetchProductsForStore,
} from "./dynamic-row-loading.demo-data";
import type { DynamicRegion, DynamicStore } from "./dynamic-row-loading.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "dynamic-row-loading-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [columnResizing]="true"
      [defaultHeaders]="headers"
      [editColumns]="true"
      [expandAll]="false"
      [height]="height"
      [onRowGroupExpand]="handleRowExpand"
      [rowGrouping]="grouping"
      [getRowId]="getRowId"
      [rows]="rows"
      [selectableCells]="true"
      [theme]="theme"
      [useOddEvenRowBackground]="true"
    ></simple-table>
  `,
})
export class DynamicRowLoadingDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  headers: AngularHeaderObject[] = defaultHeadersFromCore(dynamicRowLoadingConfig.headers);
  rows: DynamicRegion[] = generateInitialRegions();
  readonly grouping = ["stores", "products"];
  readonly getRowId = ({ row }: { row: Record<string, unknown> }) => row["id"] as string;

  handleRowExpand = async ({
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
        const newRows = [...this.rows];
        newRows[rowIndexPath[0]].stores = stores;
        this.rows = newRows;
      } else if (depth === 1 && groupingKey === "products") {
        setLoading(true);
        const products = await fetchProductsForStore((row as DynamicStore).id);
        setLoading(false);
        if (products.length === 0) {
          setEmpty(true, "No products found");
          return;
        }
        const newRows = [...this.rows];
        const region = newRows[rowIndexPath[0]];
        if (region.stores && region.stores[rowIndexPath[1]]) {
          region.stores[rowIndexPath[1]].products = products;
        }
        this.rows = newRows;
      }
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : "Failed to load data");
    }
  };
}
