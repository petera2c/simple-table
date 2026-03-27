import { SimpleTable } from "@simple-table/solid";
import type { Theme, SolidColumnEditorConfig } from "@simple-table/solid";
import type { ColumnEditorRowRendererProps } from "simple-table-core";
import { columnEditorCustomRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const CustomRow = (props: ColumnEditorRowRendererProps) => {
  return (
    <div style={{
      display: "flex",
      "align-items": "center",
      gap: "8px",
      padding: "4px 0",
      width: "100%",
    }}>
      {props.components.dragIcon}
      {props.components.checkbox}
      <span style={{ flex: "1", "font-size": "13px" }}>
        {props.components.labelContent}
      </span>
      {props.components.pinIcon}
    </div>
  );
};

const columnEditorConfig: SolidColumnEditorConfig = {
  text: "Edit Columns",
  searchEnabled: true,
  searchPlaceholder: "Find a column...",
  rowRenderer: CustomRow,
};

export default function ColumnEditorCustomRendererDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={columnEditorCustomRendererConfig.headers}
      rows={columnEditorCustomRendererConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      editColumns={columnEditorCustomRendererConfig.tableProps.editColumns}
      columnEditorConfig={columnEditorConfig}
    />
  );
}
