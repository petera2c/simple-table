import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { columnFilteringConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const ColumnFilteringDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={columnFilteringConfig.headers}
      rows={columnFilteringConfig.rows}
      height={height}
      theme={theme}
    />
  );
};

export default ColumnFilteringDemo;
