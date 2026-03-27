import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { quickFilterConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function QuickFilterDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={quickFilterConfig.headers}
      rows={quickFilterConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      quickFilter={quickFilterConfig.tableProps.quickFilter}
    />
  );
}
