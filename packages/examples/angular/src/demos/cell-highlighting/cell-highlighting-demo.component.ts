import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { cellHighlightingConfig } from "./cell-highlighting.demo-data";
import "@simple-table/angular/styles.css";
import type { CellHighlightingEmployee } from "./cell-highlighting.demo-data";

@Component({
  selector: "cell-highlighting-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [selectableCells]="selectableCells"
      [selectableColumns]="selectableColumns"
    ></simple-table>
  `,
})
export class CellHighlightingDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: CellHighlightingEmployee[] = cellHighlightingConfig.rows;
  readonly headers: AngularColumnDef<CellHighlightingEmployee>[] = cellHighlightingConfig.headers;
  readonly selectableCells = cellHighlightingConfig.tableProps.selectableCells;
  readonly selectableColumns = cellHighlightingConfig.tableProps.selectableColumns;

  getRowId = ({ row }: GetRowIdParams<CellHighlightingEmployee>) => row.id;
}
