import { SimpleTable } from "simple-table-solid";
import type { Theme } from "simple-table-solid";
import { columnSortingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function ColumnSortingDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  return (
    <SimpleTable
      defaultHeaders={columnSortingConfig.headers}
      rows={columnSortingConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      initialSortColumn={columnSortingConfig.tableProps.initialSortColumn}
      initialSortDirection={columnSortingConfig.tableProps.initialSortDirection}
    />
  );
}
