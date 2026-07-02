import {SimpleTable} from "@simple-table/react";import type { Theme } from "@simple-table/react";
import { columnSortingConfig } from "./column-sorting.demo-data";
import "@simple-table/react/styles.css";

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
