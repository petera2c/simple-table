import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { columnAlignmentConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function ColumnAlignmentDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={columnAlignmentConfig.headers}
      rows={columnAlignmentConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
