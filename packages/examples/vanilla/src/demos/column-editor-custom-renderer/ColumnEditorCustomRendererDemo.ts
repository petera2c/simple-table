import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, ColumnEditorRowRendererProps } from "simple-table-core";
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

export function renderColumnEditorCustomRendererDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: [...columnEditorCustomRendererConfig.headers],
    rows: columnEditorCustomRendererConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    editColumns: columnEditorCustomRendererConfig.tableProps.editColumns,
    columnEditorConfig: {
      text: "Edit Columns",
      searchEnabled: true,
      searchPlaceholder: "Find a column...",
      rowRenderer: customRowRenderer,
    },
  });
  return table;
}
