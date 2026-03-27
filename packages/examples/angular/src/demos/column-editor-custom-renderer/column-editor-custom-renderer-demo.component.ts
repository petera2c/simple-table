import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row, ColumnEditorConfig, ColumnEditorRowRendererProps } from "simple-table-core";
import { columnEditorCustomRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

function customRowRenderer(props: ColumnEditorRowRendererProps): HTMLElement {
  const row = document.createElement("div");
  row.style.cssText = "display:flex;align-items:center;gap:8px;padding:4px 0;width:100%";

  if (props.components.dragIcon) {
    if (typeof props.components.dragIcon === "string") {
      const s = document.createElement("span");
      s.innerHTML = props.components.dragIcon;
      row.appendChild(s);
    } else {
      row.appendChild(props.components.dragIcon as Node);
    }
  }

  if (props.components.checkbox) {
    if (typeof props.components.checkbox === "string") {
      const s = document.createElement("span");
      s.innerHTML = props.components.checkbox;
      row.appendChild(s);
    } else {
      row.appendChild(props.components.checkbox as Node);
    }
  }

  const label = document.createElement("span");
  label.style.cssText = "flex:1;font-size:13px";
  if (props.components.labelContent) {
    if (typeof props.components.labelContent === "string") {
      label.textContent = props.components.labelContent;
    } else {
      label.appendChild(props.components.labelContent as Node);
    }
  }
  row.appendChild(label);

  if (props.components.pinIcon) {
    if (typeof props.components.pinIcon === "string") {
      const s = document.createElement("span");
      s.innerHTML = props.components.pinIcon;
      row.appendChild(s);
    } else {
      row.appendChild(props.components.pinIcon as Node);
    }
  }

  return row;
}

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
    text: "Edit Columns",
    searchEnabled: true,
    searchPlaceholder: "Find a column...",
    rowRenderer: customRowRenderer,
  };
}
