import { Component, Input } from "@angular/core";
import {SimpleTableComponent, defaultHeadersFromCore} from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { nestedHeadersConfig } from "./nested-headers.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "nested-headers-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
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
  readonly headers: AngularHeaderObject[] = defaultHeadersFromCore(nestedHeadersConfig.headers);
  readonly columnResizing = nestedHeadersConfig.tableProps.columnResizing;
}
