import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { columnSelectionConfig } from "./column-selection.demo-data";
import "@simple-table/angular/styles.css";
import type { TeamMember } from "./column-selection.demo-data";

@Component({
  selector: "column-selection-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [selectableColumns]="selectableColumns"
    ></simple-table>
  `,
})
export class ColumnSelectionDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: TeamMember[] = columnSelectionConfig.rows;
  readonly headers: AngularColumnDef<TeamMember>[] = columnSelectionConfig.headers;
  readonly selectableColumns = columnSelectionConfig.tableProps.selectableColumns;

  getRowId = ({ row }: GetRowIdParams<TeamMember>) => row.id;
}
