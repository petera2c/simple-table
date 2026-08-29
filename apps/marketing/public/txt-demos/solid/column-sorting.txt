import {SimpleTable} from "@simple-table/solid";import type { Theme } from "@simple-table/solid";
import { columnSortingConfig } from "./column-sorting.demo-data";
import "@simple-table/solid/styles.css";

export default function ColumnSortingDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  return (
    <SimpleTable
      columns={columnSortingConfig.headers}
      getRowId={({ row }) => row.id}
      rows={columnSortingConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      initialSortColumn="age"
      initialSortDirection="desc"
    />
  );
}
