import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { quickStartConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "quick-start-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [editColumns]="true"
      [selectableCells]="true"
      [customTheme]="customTheme"
    ></simple-table>
  `,
})
export class QuickStartDemoComponent {
  @Input() height: string | number = "300px";
  @Input() theme?: Theme;

  readonly rows: Row[] = quickStartConfig.rows;
  readonly headers: AngularHeaderObject[] = quickStartConfig.headers;
  readonly customTheme = quickStartConfig.tableProps.customTheme;
}
