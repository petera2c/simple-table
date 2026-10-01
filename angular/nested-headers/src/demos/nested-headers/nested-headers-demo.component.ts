import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { nestedHeadersConfig } from "./nested-headers.demo-data";
import "@simple-table/angular/styles.css";
import type { StudentScores } from "./nested-headers.demo-data";

@Component({
  selector: "nested-headers-demo",
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
export class NestedHeadersDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: StudentScores[] = nestedHeadersConfig.rows;
  readonly headers: AngularColumnDef<StudentScores>[] = nestedHeadersConfig.headers;
  readonly columnResizing = nestedHeadersConfig.tableProps.columnResizing;

  getRowId = ({ row }: GetRowIdParams<StudentScores>) => row.id;
}
