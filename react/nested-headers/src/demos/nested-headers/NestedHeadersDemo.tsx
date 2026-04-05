import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { nestedHeadersConfig } from "./nested-headers.demo-data";
import "@simple-table/react/styles.css";

const NestedHeadersDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(nestedHeadersConfig.headers)}
      rows={nestedHeadersConfig.rows}
      height={height}
      theme={theme}
      columnResizing={nestedHeadersConfig.tableProps.columnResizing}
    />
  );
};

export default NestedHeadersDemo;
