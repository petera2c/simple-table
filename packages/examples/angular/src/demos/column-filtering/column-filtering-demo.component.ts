import { Component, Input } from "@angular/core";
import {SimpleTableComponent, defaultHeadersFromCore} from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { columnFilteringConfig } from "./column-filtering.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "column-filtering-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  `,
})
export class ColumnFilteringDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = columnFilteringConfig.rows;
  readonly headers: AngularHeaderObject[] = defaultHeadersFromCore(columnFilteringConfig.headers);
}
