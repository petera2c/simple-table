import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { tooltipConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "tooltip-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [selectableCells]="true"
    ></simple-table>
  `,
})
export class TooltipDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = tooltipConfig.rows;
  readonly headers: AngularHeaderObject[] = tooltipConfig.headers;
}
