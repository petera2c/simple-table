import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { valueFormatterConfig } from "./value-formatter.demo-data";
import "@simple-table/angular/styles.css";
import type { FormattedEmployee } from "./value-formatter.demo-data";

@Component({
  selector: "value-formatter-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [selectableCells]="selectableCellsProp"
    ></simple-table>
  `,
})
export class ValueFormatterDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: FormattedEmployee[] = valueFormatterConfig.rows;
  readonly headers: AngularColumnDef<FormattedEmployee>[] = valueFormatterConfig.headers;
  readonly selectableCellsProp = valueFormatterConfig.tableProps.selectableCells;

  getRowId = ({ row }: GetRowIdParams<FormattedEmployee>) => row.id;
}
