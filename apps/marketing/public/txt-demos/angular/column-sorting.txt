import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { columnSortingConfig } from "@simple-table/examples-shared";
import "@simple-table/angular/styles.css";

@Component({
  selector: "column-sorting-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [initialSortColumn]="initialSortColumn"
      [initialSortDirection]="initialSortDirection"
    ></simple-table>
  `,
})
export class ColumnSortingDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = columnSortingConfig.rows;
  readonly headers: AngularHeaderObject[] = columnSortingConfig.headers;
  readonly initialSortColumn = columnSortingConfig.tableProps.initialSortColumn;
  readonly initialSortDirection = columnSortingConfig.tableProps.initialSortDirection;
}
