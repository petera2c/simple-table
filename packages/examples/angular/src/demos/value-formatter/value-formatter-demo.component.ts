import { Component, Input } from "@angular/core";
import {SimpleTableComponent, defaultHeadersFromCore} from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { valueFormatterConfig } from "./value-formatter.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "value-formatter-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [selectableCells]="selectableCellsProp"
    ></simple-table>
  `,
})
export class ValueFormatterDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = valueFormatterConfig.rows;
  readonly headers: AngularHeaderObject[] = defaultHeadersFromCore(valueFormatterConfig.headers);
  readonly selectableCellsProp = valueFormatterConfig.tableProps.selectableCells;
}
