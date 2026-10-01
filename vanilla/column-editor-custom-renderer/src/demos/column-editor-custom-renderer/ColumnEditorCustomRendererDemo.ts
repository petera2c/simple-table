import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, ColumnEditorRowRendererProps, GetRowIdParams } from "simple-table-core";
import {
  columnEditorCustomRendererConfig,
  COLUMN_EDITOR_TEXT,
  COLUMN_EDITOR_SEARCH_PLACEHOLDER,
} from "./column-editor-custom-renderer.demo-data";
import type { ColumnEditorCustomRendererEmployee } from "./column-editor-custom-renderer.demo-data";
import "simple-table-core/styles.css";

function attachSlot(slot: unknown, host: HTMLElement): void {
  host.replaceChildren();
  if (slot == null) return;
  if (typeof slot === "string") {
    host.textContent = slot;
  } else if (slot instanceof Node) {
    host.appendChild(slot);
  }
}

function buildVanillaColumnEditorRowRenderer({
  header,
  components,
}: ColumnEditorRowRendererProps): HTMLElement {
  const row = document.createElement("div");
  Object.assign(row.style, {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 8px",
    borderRadius: "6px",
    background: "#f8fafc",
    marginBottom: "4px",
  });

  if (components.checkbox) {
    const checkboxHost = document.createElement("span");
    attachSlot(components.checkbox, checkboxHost);
    row.appendChild(checkboxHost);
  }

  const label = document.createElement("span");
  Object.assign(label.style, { flex: "1", fontSize: "13px", fontWeight: "500" });
  label.textContent = header.label;
  row.appendChild(label);

  if (components.dragIcon) {
    const dragHost = document.createElement("span");
    Object.assign(dragHost.style, { cursor: "grab", opacity: "0.5" });
    attachSlot(components.dragIcon, dragHost);
    row.appendChild(dragHost);
  }

  return row;
}

const getRowId = ({ row }: GetRowIdParams<ColumnEditorCustomRendererEmployee>) => row.id;

export function renderColumnEditorCustomRendererDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla<ColumnEditorCustomRendererEmployee> {
  return new SimpleTableVanilla(container, {
    getRowId,
    columns: columnEditorCustomRendererConfig.headers,
    rows: columnEditorCustomRendererConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    enableColumnEditor: true,
    columnEditorConfig: {
      text: COLUMN_EDITOR_TEXT,
      searchEnabled: true,
      searchPlaceholder: COLUMN_EDITOR_SEARCH_PLACEHOLDER,
      rowRenderer: buildVanillaColumnEditorRowRenderer,
    },
  });
}
