import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { rowHeightConfig } from "./row-height.demo-data";
import "@simple-table/angular/styles.css";
import type { ArchitectStaff } from "./row-height.demo-data";

@Component({
  selector: "row-height-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [customTheme]="customTheme"
    ></simple-table>
  `,
})
export class RowHeightDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: ArchitectStaff[] = rowHeightConfig.rows;
  readonly headers: AngularColumnDef<ArchitectStaff>[] = rowHeightConfig.headers;
  readonly customTheme = rowHeightConfig.tableProps.customTheme;

  getRowId = ({ row }: GetRowIdParams<ArchitectStaff>) => row.id;
}
