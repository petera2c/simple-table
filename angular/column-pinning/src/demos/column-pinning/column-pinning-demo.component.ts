import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { columnPinningConfig } from "./column-pinning.demo-data";
import "@simple-table/angular/styles.css";
import type { ColumnPinningEmployee } from "./column-pinning.demo-data";

@Component({
  selector: "column-pinning-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [columnResizing]="columnResizing"
    ></simple-table>
  `,
})
export class ColumnPinningDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: ColumnPinningEmployee[] = columnPinningConfig.rows;
  readonly headers: AngularColumnDef<ColumnPinningEmployee>[] = columnPinningConfig.headers;
  readonly columnResizing = columnPinningConfig.tableProps.columnResizing;

  getRowId = ({ row }: GetRowIdParams<ColumnPinningEmployee>) => row.id;
}
