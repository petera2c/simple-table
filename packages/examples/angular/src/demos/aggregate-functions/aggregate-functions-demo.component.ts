import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { aggregateFunctionsConfig } from "./aggregate-functions.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "aggregate-functions-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [rowGrouping]="grouping"
      [columnResizing]="true"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  `,
})
export class AggregateFunctionsDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = aggregateFunctionsConfig.rows;
  readonly headers: AngularHeaderObject[] = aggregateFunctionsConfig.headers;
  readonly grouping = aggregateFunctionsConfig.tableProps.rowGrouping;
}
