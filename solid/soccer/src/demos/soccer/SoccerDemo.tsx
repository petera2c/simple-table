import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { soccerConfig } from "./soccer.demo-data";
import "@simple-table/solid/styles.css";

export default function SoccerDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      columns={soccerConfig.headers}
      getRowId={({ row }) => row.id}
      rows={soccerConfig.rows}
      height={props.height ?? "70dvh"}
      theme={props.theme}
      columnReordering
      columnResizing
      enableColumnEditor
      selectableCells
      initialSortColumn="rating"
      initialSortDirection="desc"
      customTheme={{ headerHeight: 40, rowHeight: 48 }}
    />
  );
}
