import { SimpleTableVanilla } from "simple-table-core";
import type { SoccerPlayer } from "./soccer.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { soccerConfig } from "./soccer.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<SoccerPlayer>) => row.id;
export function renderSoccerDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<SoccerPlayer> {
  return new SimpleTableVanilla(container, {
    getRowId,
    columns: soccerConfig.headers,
    rows: soccerConfig.rows,
    height: options?.height ?? "70dvh",
    theme: options?.theme,
    columnReordering: true,
    columnResizing: true,
    enableColumnEditor: true,
    selectableCells: true,
    initialSortColumn: "rating",
    initialSortDirection: "desc",
    customTheme: { headerHeight: 40, rowHeight: 48 },
  });
}
