import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { columnFilteringConfig } from "./column-filtering.demo-data";
import "@simple-table/angular/styles.css";
import type { ColumnFilteringEmployee } from "./column-filtering.demo-data";

@Component({
  selector: "column-filtering-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  `,
})
export class ColumnFilteringDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: ColumnFilteringEmployee[] = columnFilteringConfig.rows;
  readonly headers: AngularColumnDef<ColumnFilteringEmployee>[] = columnFilteringConfig.headers;

  getRowId = ({ row }: GetRowIdParams<ColumnFilteringEmployee>) => row.id;
}
