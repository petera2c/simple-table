import { createSignal } from "solid-js";
import {SimpleTable} from "@simple-table/solid";import type { Theme, HeaderObject } from "@simple-table/solid";
import { columnReorderingConfig } from "./column-reordering.demo-data";
import "@simple-table/solid/styles.css";

export default function ColumnReorderingDemo(props: { height?: string | number; theme?: Theme }) {
  const [headers, setHeaders] = createSignal([...columnReorderingConfig.headers]);

  return (
    <SimpleTable
      columnReordering
      defaultHeaders={headers()}
      rows={columnReorderingConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      onColumnOrderChange={(h: HeaderObject[]) => setHeaders(h)}
    />
  );
}
