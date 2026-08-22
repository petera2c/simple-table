import { SimpleTableVanilla } from "simple-table-core";
import type { CrewMember } from "./column-reordering.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { columnReorderingConfig } from "./column-reordering.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<CrewMember>) => row.id;
export function renderColumnReorderingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<CrewMember> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: columnReorderingConfig.headers,
    rows: columnReorderingConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    columnReordering: true,
  });
  return table;
}
