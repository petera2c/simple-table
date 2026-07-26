import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { columnAlignmentConfig } from "./column-alignment.demo-data";
import "@simple-table/angular/styles.css";
import type { ColumnAlignmentPlayer } from "./column-alignment.demo-data";

@Component({
  selector: "column-alignment-demo",
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
export class ColumnAlignmentDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: ColumnAlignmentPlayer[] = columnAlignmentConfig.rows;
  readonly headers: AngularColumnDef<ColumnAlignmentPlayer>[] = columnAlignmentConfig.headers;

  getRowId = ({ row }: GetRowIdParams<ColumnAlignmentPlayer>) => row.id;
}
