import { SimpleTableVanilla } from "simple-table-core";
import type { TeamMember } from "./column-selection.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { columnSelectionConfig } from "./column-selection.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<TeamMember>) => row.id;
export function renderColumnSelectionDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<TeamMember> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: columnSelectionConfig.headers,
    rows: columnSelectionConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    selectableColumns: columnSelectionConfig.tableProps.selectableColumns,
  });
  return table;
}
