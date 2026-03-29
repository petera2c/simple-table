import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { rowHeightConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function RowHeightDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={rowHeightConfig.headers}
      rows={rowHeightConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      customTheme={rowHeightConfig.tableProps.customTheme}
    />
  );
}
