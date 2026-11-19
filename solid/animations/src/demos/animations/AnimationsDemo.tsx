import { createSignal } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme, SolidColumnDef } from "@simple-table/solid";
import { animationsConfig, type AnimationsCrewMember } from "./animations.demo-data";
import "@simple-table/solid/styles.css";

export default function AnimationsDemo(props: { height?: string | number; theme?: Theme }) {
  const [headers, setHeaders] = createSignal([...animationsConfig.headers]);

  const handleColumnOrderChange = (newHeaders: SolidColumnDef<AnimationsCrewMember>[]) => {
    setHeaders(newHeaders);
  };

  return (
    <SimpleTable
      columnReordering={animationsConfig.tableProps.columnReordering}
      columns={headers()}
      enableColumnEditor={animationsConfig.tableProps.enableColumnEditor}
      enableColumnEditorInitOpen={animationsConfig.tableProps.enableColumnEditorInitOpen}
      getRowId={({ row }) => row.id}
      rows={animationsConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      onColumnOrderChange={handleColumnOrderChange}
    />
  );
}
