import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { rowHeightConfig } from "@simple-table/examples-shared";
import "@simple-table/angular/styles.css";

@Component({
  selector: "row-height-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [customTheme]="customTheme"
    ></simple-table>
  `,
})
export class RowHeightDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = rowHeightConfig.rows;
  readonly headers: AngularHeaderObject[] = rowHeightConfig.headers;
  readonly customTheme = rowHeightConfig.tableProps.customTheme;
}
