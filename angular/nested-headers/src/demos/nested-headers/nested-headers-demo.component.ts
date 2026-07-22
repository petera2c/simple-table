import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, Row, Theme } from "@simple-table/angular";
import { nestedHeadersConfig } from "./nested-headers.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "nested-headers-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [columnResizing]="columnResizing"
    ></simple-table>
  `,
})
export class NestedHeadersDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = nestedHeadersConfig.rows;
  readonly headers: AngularColumnDef[] = nestedHeadersConfig.headers;
  readonly columnResizing = nestedHeadersConfig.tableProps.columnResizing;
}
