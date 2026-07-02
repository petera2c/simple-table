import {SimpleTable} from "@simple-table/solid";import type { Theme } from "@simple-table/solid";
import { columnFilteringConfig } from "./column-filtering.demo-data";
import "@simple-table/solid/styles.css";

export default function ColumnFilteringDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  return (
    <SimpleTable
      defaultHeaders={columnFilteringConfig.headers}
      rows={columnFilteringConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
