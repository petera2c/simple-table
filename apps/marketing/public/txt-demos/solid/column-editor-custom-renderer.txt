import {
  SimpleTable,
  type ColumnEditorRowRendererProps,
  type SolidColumnEditorConfig,
  type Theme,
} from "@simple-table/solid";
import { createEffect } from "solid-js";
import {
  columnEditorCustomRendererConfig,
  COLUMN_EDITOR_TEXT,
  COLUMN_EDITOR_SEARCH_PLACEHOLDER,
} from "./column-editor-custom-renderer.demo-data";
import "@simple-table/solid/styles.css";

function attach(slot: unknown, host: HTMLElement | undefined): void {
  if (!host) return;
  host.replaceChildren();
  if (slot == null) return;
  if (typeof slot === "string") {
    host.textContent = slot;
  } else if (slot instanceof Node) {
    host.appendChild(slot);
  }
}

function SlotHost(props: { slot: () => unknown; style?: string }) {
  let host: HTMLSpanElement | undefined;
  createEffect(() => {
    attach(props.slot(), host);
  });
  return (
    <span
      ref={(el) => {
        host = el;
        attach(props.slot(), el);
      }}
      style={props.style}
    />
  );
}

const CustomRowRenderer = (p: ColumnEditorRowRendererProps) => (
  <div
    style={{
      display: "flex",
      "align-items": "center",
      gap: "8px",
      padding: "6px 8px",
      "border-radius": "6px",
      background: "#f8fafc",
      "margin-bottom": "4px",
    }}
  >
    {p.components.checkbox && <SlotHost slot={() => p.components.checkbox} />}
    <span style={{ flex: "1", "font-size": "13px", "font-weight": "500" }}>{p.header.label}</span>
    {p.components.dragIcon && (
      <SlotHost slot={() => p.components.dragIcon} style={{ cursor: "grab", opacity: "0.5" }} />
    )}
  </div>
);

const columnEditorConfig: SolidColumnEditorConfig = {
  text: COLUMN_EDITOR_TEXT,
  searchEnabled: true,
  searchPlaceholder: COLUMN_EDITOR_SEARCH_PLACEHOLDER,
  rowRenderer: CustomRowRenderer,
};

export default function ColumnEditorCustomRendererDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={columnEditorCustomRendererConfig.headers}
      rows={columnEditorCustomRendererConfig.rows}
      editColumns
      columnEditorConfig={columnEditorConfig}
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
