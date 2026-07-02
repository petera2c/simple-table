import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularHeaderObject, ColumnVisibilityState, Row, Theme } from "@simple-table/angular";
import { columnVisibilityConfig, getColumnVisibilityDemoHeaders, loadColumnVisibilityDemoSaved, saveColumnVisibilityDemoState } from "./column-visibility.demo-data";
import { MarketingColumnEditorRowComponent } from "./marketing-column-editor-row.component";
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
      [editColumnsInitOpen]="tableProps.editColumnsInitOpen"
      [columnEditorConfig]="columnEditorConfig"
      [onColumnVisibilityChange]="onVisibilityChange"
    ></simple-table>
  `,
})
export class ColumnVisibilityDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = columnVisibilityConfig.rows;
  readonly headers: AngularHeaderObject[] = getColumnVisibilityDemoHeaders(
    loadColumnVisibilityDemoSaved(),
  );
  readonly tableProps = columnVisibilityConfig.tableProps;
  readonly columnEditorConfig = {
    ...columnVisibilityConfig.tableProps.columnEditorConfig,
    rowRenderer: MarketingColumnEditorRowComponent,
  };

  readonly onVisibilityChange = (state: ColumnVisibilityState) => {
    saveColumnVisibilityDemoState(state);
  };
}
