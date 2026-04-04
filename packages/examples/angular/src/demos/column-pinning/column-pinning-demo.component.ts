import { Component, Input } from "@angular/core";
import {SimpleTableComponent, defaultHeadersFromCore} from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { columnPinningConfig } from "./column-pinning.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "column-pinning-demo",
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
export class ColumnPinningDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = columnPinningConfig.rows;
  readonly headers: AngularHeaderObject[] = defaultHeadersFromCore(columnPinningConfig.headers);
  readonly columnResizing = columnPinningConfig.tableProps.columnResizing;
}
