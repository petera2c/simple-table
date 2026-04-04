import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { columnSelectionConfig } from "./column-selection.demo-data";
import "@simple-table/react/styles.css";

const ColumnSelectionDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(columnSelectionConfig.headers)}
      rows={columnSelectionConfig.rows}
      height={height}
      theme={theme}
      selectableColumns={columnSelectionConfig.tableProps.selectableColumns}
    />
  );
};

export default ColumnSelectionDemo;
