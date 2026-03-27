import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { quickFilterConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "quick-filter-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [quickFilter]="quickFilter"
    ></simple-table>
  `,
})
export class QuickFilterDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = quickFilterConfig.rows;
  readonly headers: AngularHeaderObject[] = quickFilterConfig.headers;
  readonly quickFilter = quickFilterConfig.tableProps.quickFilter;
}
