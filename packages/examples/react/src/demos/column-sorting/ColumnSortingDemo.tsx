import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { columnSortingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const ColumnSortingDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={columnSortingConfig.headers}
      rows={columnSortingConfig.rows}
      height={height}
      theme={theme}
      initialSortColumn={columnSortingConfig.tableProps.initialSortColumn}
      initialSortDirection={columnSortingConfig.tableProps.initialSortDirection}
    />
  );
};

export default ColumnSortingDemo;
