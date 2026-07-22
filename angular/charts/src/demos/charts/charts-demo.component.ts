import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, Row, Theme } from "@simple-table/angular";
import { chartsConfig } from "./charts.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "charts-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [columnReordering]="true"
      [columnResizing]="true"
      [columns]="headers"
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

  readonly headers: AngularColumnDef[] = chartsConfig.headers;
  readonly rows: Row[] = chartsConfig.rows;
}
