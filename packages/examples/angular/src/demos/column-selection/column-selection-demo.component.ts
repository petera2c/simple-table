import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { columnSelectionConfig } from "@simple-table/examples-shared";
import "@simple-table/angular/styles.css";

@Component({
  selector: "column-selection-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
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
  readonly headers: AngularHeaderObject[] = columnSelectionConfig.headers;
  readonly selectableColumns = columnSelectionConfig.tableProps.selectableColumns;
}
