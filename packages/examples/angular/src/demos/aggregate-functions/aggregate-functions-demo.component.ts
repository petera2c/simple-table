import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { aggregateFunctionsConfig } from "./aggregate-functions.demo-data";
import "@simple-table/angular/styles.css";
import type { AggregateFunctionsRow } from "./aggregate-functions.demo-data";

@Component({
  selector: "aggregate-functions-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
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

  readonly rows: AggregateFunctionsRow[] = aggregateFunctionsConfig.rows;
  readonly headers: AngularColumnDef<AggregateFunctionsRow>[] = aggregateFunctionsConfig.headers;
  readonly grouping = aggregateFunctionsConfig.tableProps.rowGrouping;

  getRowId = ({ row }: GetRowIdParams<AggregateFunctionsRow>) => row.id;
}
