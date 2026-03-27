import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { nestedHeadersConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

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
  readonly headers: AngularHeaderObject[] = nestedHeadersConfig.headers;
  readonly columnResizing = nestedHeadersConfig.tableProps.columnResizing;
}
