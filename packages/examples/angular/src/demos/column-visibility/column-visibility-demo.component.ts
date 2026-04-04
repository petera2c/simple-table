import { Component, Input } from "@angular/core";
import {SimpleTableComponent, defaultHeadersFromCore} from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { columnVisibilityConfig } from "./column-visibility.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "column-visibility-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [editColumns]="tableProps.editColumns"
      [columnEditorConfig]="tableProps.columnEditorConfig"
    ></simple-table>
  `,
})
export class ColumnVisibilityDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = columnVisibilityConfig.rows;
  readonly headers: AngularHeaderObject[] = defaultHeadersFromCore(columnVisibilityConfig.headers);
  readonly tableProps = columnVisibilityConfig.tableProps;
}
