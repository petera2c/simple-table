import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { nestedHeadersConfig } from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

export default function NestedHeadersDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={nestedHeadersConfig.headers}
      rows={nestedHeadersConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      columnResizing={nestedHeadersConfig.tableProps.columnResizing}
    />
  );
}
