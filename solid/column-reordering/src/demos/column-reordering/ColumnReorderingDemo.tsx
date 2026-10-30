import { createSignal } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme, SolidColumnDef } from "@simple-table/solid";
import { columnReorderingConfig, type CrewMember } from "./column-reordering.demo-data";
import "@simple-table/solid/styles.css";

export default function ColumnReorderingDemo(props: { height?: string | number; theme?: Theme }) {
  const [headers, setHeaders] = createSignal([...columnReorderingConfig.headers]);

  const handleColumnOrderChange = (newHeaders: SolidColumnDef<CrewMember>[]) => {
    setHeaders(newHeaders);
  };

  return (
    <SimpleTable
      columnReordering={columnReorderingConfig.tableProps.columnReordering}
      columns={headers()}
      getRowId={({ row }) => row.id}
      rows={columnReorderingConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      onColumnOrderChange={handleColumnOrderChange}
    />
  );
}
