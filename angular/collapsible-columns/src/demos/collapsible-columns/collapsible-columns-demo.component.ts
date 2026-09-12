import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { collapsibleColumnsConfig } from "./collapsible-columns.demo-data";
import "@simple-table/angular/styles.css";
import type { CollapsibleSalesRep } from "./collapsible-columns.demo-data";

@Component({
  selector: "collapsible-columns-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [columnResizing]="true"
      [enableColumnEditor]="true"
      [selectableCells]="true"
      [columnReordering]="true"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  `,
})
export class CollapsibleColumnsDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: CollapsibleSalesRep[] = collapsibleColumnsConfig.rows;
  readonly headers: AngularColumnDef<CollapsibleSalesRep>[] = collapsibleColumnsConfig.headers;

  getRowId = ({ row }: GetRowIdParams<CollapsibleSalesRep>) => row.id;
}
