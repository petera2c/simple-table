import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { columnVisibilityConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const ColumnVisibilityDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={columnVisibilityConfig.headers}
      rows={columnVisibilityConfig.rows}
      editColumns={columnVisibilityConfig.tableProps.editColumns}
      columnEditorConfig={columnVisibilityConfig.tableProps.columnEditorConfig}
      height={height}
      theme={theme}
    />
  );
};

export default ColumnVisibilityDemo;
