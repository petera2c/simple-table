import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { columnFilteringConfig } from "./column-filtering.demo-data";
import "@simple-table/react/styles.css";

const ColumnFilteringDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(columnFilteringConfig.headers)}
      rows={columnFilteringConfig.rows}
      height={height}
      theme={theme}
    />
  );
};

export default ColumnFilteringDemo;
