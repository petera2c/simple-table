import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, CellRenderer, Row, Theme } from "@simple-table/angular";
import { billingConfig } from "@simple-table/examples-shared";
import type { BillingRow } from "@simple-table/examples-shared";
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

  readonly headers: AngularHeaderObject[] = billingConfig.headers.map((h) => {
    if (h.accessor === "name") {
      const nameRenderer: CellRenderer = ({ row }) => {
        const d = row as unknown as BillingRow;
        if (d.type === "account") {
          const span = document.createElement("span");
          span.style.fontWeight = "600";
          span.textContent = d.name;
          return span;
        }
        return d.name;
      };
      return { ...h, cellRenderer: nameRenderer };
    }
    return { ...h };
  });
}
