import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row, ColumnEditorConfig } from "simple-table-core";
import {
  columnEditorCustomRendererConfig,
  COLUMN_EDITOR_TEXT,
  COLUMN_EDITOR_SEARCH_PLACEHOLDER,
  buildVanillaColumnEditorRowRenderer,
} from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

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
  readonly headers: AngularHeaderObject[] = columnEditorCustomRendererConfig.headers;
  readonly editorConfig: ColumnEditorConfig = {
    text: COLUMN_EDITOR_TEXT,
    searchEnabled: true,
    searchPlaceholder: COLUMN_EDITOR_SEARCH_PLACEHOLDER,
    rowRenderer: buildVanillaColumnEditorRowRenderer,
  };
}
