import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { chartsConfig } from "@simple-table/examples-shared";
import "@simple-table/angular/styles.css";

@Component({
  selector: "charts-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [columnReordering]="true"
      [columnResizing]="true"
      [defaultHeaders]="headers"
      [rows]="rows"
      [selectableCells]="true"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  `,
})
export class ChartsDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularHeaderObject[] = chartsConfig.headers;
  readonly rows: Row[] = chartsConfig.rows;
}
