import {SimpleTable} from "@simple-table/solid";import type { Theme } from "@simple-table/solid";
import { columnSelectionConfig } from "./column-selection.demo-data";
import "@simple-table/solid/styles.css";

export default function ColumnSelectionDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={columnSelectionConfig.headers}
      rows={columnSelectionConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      selectableColumns={columnSelectionConfig.tableProps.selectableColumns}
    />
  );
}
