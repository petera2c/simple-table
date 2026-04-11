import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { columnPinningConfig } from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

export default function ColumnPinningDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={columnPinningConfig.headers}
      rows={columnPinningConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      columnResizing={columnPinningConfig.tableProps.columnResizing}
    />
  );
}
