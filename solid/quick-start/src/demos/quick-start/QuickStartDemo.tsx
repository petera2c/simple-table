import {SimpleTable} from "@simple-table/solid";import type { Theme } from "@simple-table/solid";
import { quickStartConfig } from "./quick-start.demo-data";
import "@simple-table/solid/styles.css";

export default function QuickStartDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  return (
    <SimpleTable
      defaultHeaders={quickStartConfig.headers}
      rows={quickStartConfig.rows}
      height={props.height ?? "300px"}
      theme={props.theme}
      editColumns={quickStartConfig.tableProps.editColumns}
      selectableCells={quickStartConfig.tableProps.selectableCells}
      customTheme={quickStartConfig.tableProps.customTheme}
    />
  );
}
