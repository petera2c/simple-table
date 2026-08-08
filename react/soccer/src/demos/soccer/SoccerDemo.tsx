import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { soccerConfig } from "./soccer.demo-data";
import "@simple-table/react/styles.css";

const SoccerDemo = ({ height = "70dvh", theme }: { height?: string | number; theme?: Theme }) => {
  return (
    <SimpleTable
      columns={soccerConfig.headers}
      rows={soccerConfig.rows}
      height={height}
      theme={theme}
      columnReordering
      columnResizing
      enableColumnEditor
      selectableCells
      initialSortColumn="rating"
      initialSortDirection="desc"
      customTheme={{ headerHeight: 40, rowHeight: 48 }}
      getRowId={({ row }) => row.id}
    />
  );
};

export default SoccerDemo;
