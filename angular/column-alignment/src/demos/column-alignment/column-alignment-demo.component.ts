import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, Row, Theme } from "@simple-table/angular";
import { columnAlignmentConfig } from "./column-alignment.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "column-alignment-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
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

  readonly rows: Row[] = columnAlignmentConfig.rows;
  readonly headers: AngularColumnDef[] = columnAlignmentConfig.headers;
}
