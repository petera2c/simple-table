import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { columnSortingConfig } from "./column-sorting.demo-data";
import "@simple-table/angular/styles.css";
import type { FacultyMember } from "./column-sorting.demo-data";

@Component({
  selector: "column-sorting-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      initialSortColumn="age"
      initialSortDirection="desc"
    ></simple-table>
  `,
})
export class ColumnSortingDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: FacultyMember[] = columnSortingConfig.rows;
  readonly headers: AngularColumnDef<FacultyMember>[] = columnSortingConfig.headers;

  getRowId = ({ row }: GetRowIdParams<FacultyMember>) => row.id;
}
