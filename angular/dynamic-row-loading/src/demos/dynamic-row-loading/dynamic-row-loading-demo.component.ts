import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, OnRowGroupExpandProps, Theme } from "@simple-table/angular";
import {
  dynamicRowLoadingConfig,
  generateInitialRegions,
  fetchStoresForRegion,
  fetchProductsForStore,
} from "./dynamic-row-loading.demo-data";
import type { DynamicRegion, DynamicTreeRow } from "./dynamic-row-loading.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "dynamic-row-loading-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [columnResizing]="true"
      [columns]="headers"
      [enableColumnEditor]="true"
      [expandAll]="false"
      [height]="height"
      [onRowGroupExpand]="handleRowExpand"
      [rowGrouping]="grouping"
      [getRowId]="getRowId"
      [rows]="rows"
      [selectableCells]="true"
      [theme]="theme"
      [oddEvenRowBackground]="true"
    ></simple-table>
  `,
})
export class DynamicRowLoadingDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  headers: AngularColumnDef<DynamicTreeRow>[] = dynamicRowLoadingConfig.headers;
  rows: DynamicRegion[] = generateInitialRegions();
  readonly grouping = ["stores", "products"];
  readonly getRowId = ({ row }: GetRowIdParams<DynamicTreeRow>) => row.id;

  handleRowExpand = async ({
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
          setEmpty(true, "No stores found");
          return;
        }
        const newRows = [...this.rows];
        newRows[rowIndexPath[0]].stores = stores;
        this.rows = newRows;
      } else if (depth === 1 && groupingKey === "products" && row.type === "store") {
        setLoading(true);
        const products = await fetchProductsForStore(row.id);
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
