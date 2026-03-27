import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { columnVisibilityConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "column-visibility-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [editColumns]="true"
    ></simple-table>
  `,
})
export class ColumnVisibilityDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = columnVisibilityConfig.rows;
  readonly headers: AngularHeaderObject[] = columnVisibilityConfig.headers;
}
