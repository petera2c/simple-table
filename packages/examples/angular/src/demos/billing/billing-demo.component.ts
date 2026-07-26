import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { billingConfig } from "./billing.demo-data";
import { BillingNameCellComponent } from "./billing-name-cell.component";
import "@simple-table/angular/styles.css";
import type { BillingRow } from "./billing.demo-data";

@Component({
  selector: "billing-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [columnReordering]="true"
      [columnResizing]="true"
      [columns]="headers"
      [enableColumnEditor]="true"
      [height]="height"
      [initialSortColumn]="'amount'"
      [initialSortDirection]="'desc'"
      [rowGrouping]="grouping"
      [rows]="rows"
      [selectableCells]="true"
      [theme]="theme"
      [oddColumnBackground]="true"
    ></simple-table>
  `,
})
export class BillingDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly grouping = ["invoices", "charges"];
  readonly rows: BillingRow[] = billingConfig.rows;

  readonly headers: AngularColumnDef<BillingRow>[] = billingConfig.headers.map((h) =>
    h.accessor === "name" ? { ...h, cellRenderer: BillingNameCellComponent } : h,
  );

  getRowId = ({ row }: GetRowIdParams<BillingRow>) => row.id;
}
