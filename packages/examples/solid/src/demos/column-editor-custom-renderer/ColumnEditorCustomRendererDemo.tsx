import { SimpleTable } from "@simple-table/solid";
import type { Theme, SolidColumnEditorConfig } from "@simple-table/solid";
import type { ColumnEditorRowRendererProps } from "simple-table-core";
import {
  columnEditorCustomRendererConfig,
  COLUMN_EDITOR_TEXT,
  COLUMN_EDITOR_SEARCH_PLACEHOLDER,
} from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

const CustomRowRenderer = ({ header, components }: ColumnEditorRowRendererProps) => (
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
    {components.checkbox && (
      <span innerHTML={typeof components.checkbox === "string" ? components.checkbox : ""} />
    )}
    <span style={{ flex: "1", "font-size": "13px", "font-weight": "500" }}>{header.label}</span>
    {components.dragIcon && (
      <span
        style={{ cursor: "grab", opacity: "0.5" }}
        innerHTML={typeof components.dragIcon === "string" ? components.dragIcon : ""}
      />
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
