import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, Row, Theme } from "@simple-table/angular";
import { columnSelectionConfig } from "./column-selection.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "column-selection-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
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

  readonly rows: Row[] = columnSelectionConfig.rows;
  readonly headers: AngularColumnDef[] = columnSelectionConfig.headers;
  readonly selectableColumns = columnSelectionConfig.tableProps.selectableColumns;
}
