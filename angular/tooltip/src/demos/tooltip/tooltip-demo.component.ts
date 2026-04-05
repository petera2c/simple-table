import { Component, Input } from "@angular/core";
import {SimpleTableComponent, defaultHeadersFromCore} from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { tooltipConfig } from "./tooltip.demo-data";
import "@simple-table/angular/styles.css";

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
      [columnResizing]="true"
      [columnReordering]="true"
      [selectableCells]="true"
    ></simple-table>
  `,
})
export class TooltipDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = tooltipConfig.rows;
  readonly headers: AngularHeaderObject[] = defaultHeadersFromCore(tooltipConfig.headers);
}
