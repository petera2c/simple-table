import { Component, Input } from "@angular/core";
import {SimpleTableComponent, defaultHeadersFromCore} from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { quickStartConfig } from "./quick-start.demo-data";
import "@simple-table/angular/styles.css";

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
      [editColumns]="editColumnsProp"
      [selectableCells]="selectableCellsProp"
      [customTheme]="customTheme"
    ></simple-table>
  `,
})
export class QuickStartDemoComponent {
  @Input() height: string | number = "300px";
  @Input() theme?: Theme;

  readonly rows: Row[] = quickStartConfig.rows;
  readonly headers: AngularHeaderObject[] = defaultHeadersFromCore(quickStartConfig.headers);
  readonly editColumnsProp = quickStartConfig.tableProps.editColumns;
  readonly selectableCellsProp = quickStartConfig.tableProps.selectableCells;
  readonly customTheme = quickStartConfig.tableProps.customTheme;
}
