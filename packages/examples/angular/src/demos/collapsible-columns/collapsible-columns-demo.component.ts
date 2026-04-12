import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { collapsibleColumnsConfig } from "./collapsible-columns.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "collapsible-columns-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [columnResizing]="true"
      [editColumns]="true"
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

  readonly rows: Row[] = collapsibleColumnsConfig.rows;
  readonly headers: AngularHeaderObject[] = collapsibleColumnsConfig.headers;
}
