import { createSignal } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { animationsConfig } from "./animations.demo-data";
import "@simple-table/solid/styles.css";

export default function AnimationsDemo(props: { height?: string | number; theme?: Theme }) {
  const [headers, setHeaders] = createSignal([...animationsConfig.headers]);

  return (
    <SimpleTable
      columnReordering
      defaultHeaders={headers()}
      editColumns
      editColumnsInitOpen
      rows={animationsConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      onColumnOrderChange={setHeaders}
    />
  );
}
