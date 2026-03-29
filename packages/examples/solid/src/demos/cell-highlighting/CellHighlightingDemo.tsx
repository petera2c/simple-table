import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { cellHighlightingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function CellHighlightingDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={cellHighlightingConfig.headers}
      rows={cellHighlightingConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      selectableCells={cellHighlightingConfig.tableProps.selectableCells}
      selectableColumns={cellHighlightingConfig.tableProps.selectableColumns}
    />
  );
}
