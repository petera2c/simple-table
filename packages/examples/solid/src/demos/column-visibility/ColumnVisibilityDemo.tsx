import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { columnVisibilityConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function ColumnVisibilityDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={columnVisibilityConfig.headers}
      rows={columnVisibilityConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      editColumns={columnVisibilityConfig.tableProps.editColumns}
      columnEditorConfig={columnVisibilityConfig.tableProps.columnEditorConfig}
    />
  );
}
