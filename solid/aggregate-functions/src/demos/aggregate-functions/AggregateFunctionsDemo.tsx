import {SimpleTable} from "@simple-table/solid";import type { Theme } from "@simple-table/solid";
import { aggregateFunctionsConfig } from "./aggregate-functions.demo-data";
import "@simple-table/solid/styles.css";

export default function AggregateFunctionsDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  return (
    <SimpleTable
      defaultHeaders={aggregateFunctionsConfig.headers}
      rows={aggregateFunctionsConfig.rows}
      rowGrouping={aggregateFunctionsConfig.tableProps.rowGrouping}
      columnResizing
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
