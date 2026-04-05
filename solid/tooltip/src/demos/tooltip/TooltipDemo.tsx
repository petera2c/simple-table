import {SimpleTable, defaultHeadersFromCore} from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { tooltipConfig } from "./tooltip.demo-data";
import "@simple-table/solid/styles.css";

export default function TooltipDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(tooltipConfig.headers)}
      rows={tooltipConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      columnResizing={tooltipConfig.tableProps.columnResizing}
      columnReordering={tooltipConfig.tableProps.columnReordering}
      selectableCells={tooltipConfig.tableProps.selectableCells}
    />
  );
}
