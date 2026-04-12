import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { columnPinningConfig } from "./column-pinning.demo-data";
import "@simple-table/react/styles.css";

const ColumnPinningDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(columnPinningConfig.headers)}
      rows={columnPinningConfig.rows}
      height={height}
      theme={theme}
      columnResizing={columnPinningConfig.tableProps.columnResizing}
    />
  );
};

export default ColumnPinningDemo;
