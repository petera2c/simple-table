import { SimpleTableVanilla } from "simple-table-core";
import type { FacultyMember } from "./column-sorting.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { columnSortingConfig } from "./column-sorting.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<FacultyMember>) => row.id;
export function renderColumnSortingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<FacultyMember> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: columnSortingConfig.headers,
    rows: columnSortingConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    initialSortColumn: "age",
    initialSortDirection: "desc",
  });
  return table;
}
