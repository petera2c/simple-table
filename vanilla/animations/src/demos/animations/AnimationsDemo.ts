import { SimpleTableVanilla } from "simple-table-core";
import type { AnimationsCrewMember } from "./animations.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { animationsConfig } from "./animations.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<AnimationsCrewMember>) => row.id;
export function renderAnimationsDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<AnimationsCrewMember> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: animationsConfig.headers,
    rows: animationsConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    columnReordering: true,
    enableColumnEditor: true,
    enableColumnEditorInitOpen: true,
  });
  return table;
}
