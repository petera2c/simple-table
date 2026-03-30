import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { columnPinningConfig } from "@simple-table/examples-shared";
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
  readonly headers: AngularHeaderObject[] = columnPinningConfig.headers;
  readonly columnResizing = columnPinningConfig.tableProps.columnResizing;
}
