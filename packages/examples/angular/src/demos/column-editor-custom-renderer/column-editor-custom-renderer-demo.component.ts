import { Component, Input } from "@angular/core";
import {SimpleTableComponent, defaultHeadersFromCore} from "@simple-table/angular";
import type { AngularHeaderObject, ColumnEditorConfig, Row, Theme } from "@simple-table/angular";
import {
  columnEditorCustomRendererConfig,
  COLUMN_EDITOR_TEXT,
  COLUMN_EDITOR_SEARCH_PLACEHOLDER,
  buildVanillaColumnEditorRowRenderer,
} from "./column-editor-custom-renderer.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "column-editor-custom-renderer-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [editColumns]="true"
      [columnEditorConfig]="editorConfig"
    ></simple-table>
  `,
})
export class ColumnEditorCustomRendererDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = columnEditorCustomRendererConfig.rows;
  readonly headers: AngularHeaderObject[] = defaultHeadersFromCore(columnEditorCustomRendererConfig.headers);
  readonly editorConfig: ColumnEditorConfig = {
    text: COLUMN_EDITOR_TEXT,
    searchEnabled: true,
    searchPlaceholder: COLUMN_EDITOR_SEARCH_PLACEHOLDER,
    rowRenderer: buildVanillaColumnEditorRowRenderer,
  };
}
