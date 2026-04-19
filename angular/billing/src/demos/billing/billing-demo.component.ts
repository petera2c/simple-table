import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { billingConfig } from "./billing.demo-data";
import { BillingNameCellComponent } from "./billing-name-cell.component";
import "@simple-table/angular/styles.css";

@Component({
  selector: "billing-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [columnReordering]="true"
      [columnResizing]="true"
      [defaultHeaders]="headers"
      [editColumns]="true"
      [height]="height"
      [initialSortColumn]="'amount'"
      [initialSortDirection]="'desc'"
      [rowGrouping]="grouping"
      [rows]="rows"
      [selectableCells]="true"
      [theme]="theme"
      [useOddColumnBackground]="true"
    ></simple-table>
  `,
})
export class BillingDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly grouping = ["invoices", "charges"];
  readonly rows: Row[] = billingConfig.rows as unknown as Row[];

  readonly headers: AngularHeaderObject[] = billingConfig.headers.map((h) =>
    h.accessor === "name" ? { ...h, cellRenderer: BillingNameCellComponent } : h,
  );
}
