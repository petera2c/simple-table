import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, ColumnVisibilityState, GetRowIdParams, Theme } from "@simple-table/angular";
import { columnVisibilityConfig, getColumnVisibilityDemoHeaders, loadColumnVisibilityDemoSaved, saveColumnVisibilityDemoState } from "./column-visibility.demo-data";
import { MarketingColumnEditorRowComponent } from "./marketing-column-editor-row.component";
import "@simple-table/angular/styles.css";
import type { VisibilityEmployee } from "./column-visibility.demo-data";

@Component({
  selector: "column-visibility-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [enableColumnEditor]="tableProps.enableColumnEditor"
      [enableColumnEditorInitOpen]="tableProps.enableColumnEditorInitOpen"
      [columnEditorConfig]="columnEditorConfig"
      [onColumnVisibilityChange]="onVisibilityChange"
    ></simple-table>
  `,
})
export class ColumnVisibilityDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: VisibilityEmployee[] = columnVisibilityConfig.rows;
  readonly headers: AngularColumnDef<VisibilityEmployee>[] = getColumnVisibilityDemoHeaders(
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

  getRowId = ({ row }: GetRowIdParams<VisibilityEmployee>) => row.id;
}
