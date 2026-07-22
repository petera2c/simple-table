import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularColumnDef, Row, Theme } from "@simple-table/angular";
import { columnReorderingConfig } from "./column-reordering.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "column-reordering-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [columnReordering]="true"
      (columnOrderChange)="onColumnOrderChange($event)"
    ></simple-table>
  `,
})
export class ColumnReorderingDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = columnReorderingConfig.rows;
  headers: AngularColumnDef[] = [...columnReorderingConfig.headers];

  onColumnOrderChange(newHeaders: AngularColumnDef[]): void {
    this.headers = newHeaders;
  }
}
