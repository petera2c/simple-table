import {SimpleTable, defaultHeadersFromCore} from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { columnVisibilityConfig } from "./column-visibility.demo-data";
import "@simple-table/solid/styles.css";

export default function ColumnVisibilityDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(columnVisibilityConfig.headers)}
      rows={columnVisibilityConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      editColumns={columnVisibilityConfig.tableProps.editColumns}
      columnEditorConfig={columnVisibilityConfig.tableProps.columnEditorConfig}
    />
  );
}
