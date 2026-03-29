import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { collapsibleColumnsConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function CollapsibleColumnsDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  return (
    <SimpleTable
      defaultHeaders={collapsibleColumnsConfig.headers}
      rows={collapsibleColumnsConfig.rows}
      columnResizing
      editColumns
      selectableCells
      columnReordering
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
