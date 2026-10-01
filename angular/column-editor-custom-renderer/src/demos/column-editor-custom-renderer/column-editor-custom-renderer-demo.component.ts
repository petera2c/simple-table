import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularColumnDef, AngularColumnEditorConfig, GetRowIdParams, Theme } from "@simple-table/angular";
import {
  columnEditorCustomRendererConfig,
  COLUMN_EDITOR_SEARCH_PLACEHOLDER,
  COLUMN_EDITOR_TEXT,
} from "./column-editor-custom-renderer.demo-data";
import { ColumnEditorCustomRowComponent } from "./column-editor-custom-row.component";
import "@simple-table/angular/styles.css";
import type { ColumnEditorCustomRendererEmployee } from "./column-editor-custom-renderer.demo-data";

@Component({
  selector: "column-editor-custom-renderer-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [enableColumnEditor]="true"
      [columnEditorConfig]="editorConfig"
    ></simple-table>
  `,
})
export class ColumnEditorCustomRendererDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: ColumnEditorCustomRendererEmployee[] = columnEditorCustomRendererConfig.rows;
  readonly headers: AngularColumnDef<ColumnEditorCustomRendererEmployee>[] = columnEditorCustomRendererConfig.headers;
  readonly editorConfig: AngularColumnEditorConfig = {
    text: COLUMN_EDITOR_TEXT,
    searchEnabled: true,
    searchPlaceholder: COLUMN_EDITOR_SEARCH_PLACEHOLDER,
    rowRenderer: ColumnEditorCustomRowComponent,
  };

  getRowId = ({ row }: GetRowIdParams<ColumnEditorCustomRendererEmployee>) => row.id;
}
