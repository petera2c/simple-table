import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { chartsConfig } from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

export default function ChartsDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      columnReordering={chartsConfig.tableProps.columnReordering}
      columnResizing={chartsConfig.tableProps.columnResizing}
      defaultHeaders={chartsConfig.headers}
      rows={chartsConfig.rows}
      selectableCells={chartsConfig.tableProps.selectableCells}
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
