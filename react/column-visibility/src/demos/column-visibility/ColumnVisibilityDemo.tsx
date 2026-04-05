import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { columnVisibilityConfig } from "./column-visibility.demo-data";
import "@simple-table/react/styles.css";

const ColumnVisibilityDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(columnVisibilityConfig.headers)}
      rows={columnVisibilityConfig.rows}
      editColumns={columnVisibilityConfig.tableProps.editColumns}
      columnEditorConfig={columnVisibilityConfig.tableProps.columnEditorConfig}
      height={height}
      theme={theme}
    />
  );
};

export default ColumnVisibilityDemo;
