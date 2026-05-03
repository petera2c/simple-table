import {SimpleTable} from "@simple-table/solid";import type { Theme } from "@simple-table/solid";
import { valueFormatterConfig } from "./value-formatter.demo-data";
import "@simple-table/solid/styles.css";

export default function ValueFormatterDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  return (
    <SimpleTable
      defaultHeaders={valueFormatterConfig.headers}
      rows={valueFormatterConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      selectableCells={valueFormatterConfig.tableProps.selectableCells}
    />
  );
}
