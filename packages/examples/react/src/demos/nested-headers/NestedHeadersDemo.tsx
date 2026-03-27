import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { nestedHeadersConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const NestedHeadersDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={nestedHeadersConfig.headers}
      rows={nestedHeadersConfig.rows}
      height={height}
      theme={theme}
      columnResizing={nestedHeadersConfig.tableProps.columnResizing}
    />
  );
};

export default NestedHeadersDemo;
