import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactColumnEditorConfig, ColumnEditorRowRendererProps } from "@simple-table/react";
import { columnEditorCustomRendererConfig } from "./column-editor-custom-renderer.demo-data";
import "@simple-table/react/styles.css";

const CustomRowRenderer = ({ header, components }: ColumnEditorRowRendererProps) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 8px",
      borderRadius: 6,
      background: "#f8fafc",
      marginBottom: 4,
    }}
  >
    {components.checkbox != null && <span>{components.checkbox}</span>}
    <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{header.label}</span>
    {components.dragIcon != null && (
      <span style={{ cursor: "grab", opacity: 0.5 }}>{components.dragIcon}</span>
    )}
  </div>
);

const columnEditorConfig: ReactColumnEditorConfig = {
  text: "Manage Columns",
  searchEnabled: true,
  searchPlaceholder: "Search columns…",
  rowRenderer: CustomRowRenderer,
};

const ColumnEditorCustomRendererDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={columnEditorCustomRendererConfig.headers}
      rows={columnEditorCustomRendererConfig.rows}
      editColumns
      columnEditorConfig={columnEditorConfig}
      height={height}
      theme={theme}
    />
  );
};

export default ColumnEditorCustomRendererDemo;
