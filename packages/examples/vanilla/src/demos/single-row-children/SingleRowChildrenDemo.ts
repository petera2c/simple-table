import { SimpleTableVanilla } from "simple-table-core";
import type { StudentRecord } from "./single-row-children.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { singleRowChildrenConfig } from "./single-row-children.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<StudentRecord>) => row.id;
export function renderSingleRowChildrenDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<StudentRecord> {
  return new SimpleTableVanilla(container, {
    getRowId,
    columns: singleRowChildrenConfig.headers,
    rows: singleRowChildrenConfig.rows,
    columnResizing: singleRowChildrenConfig.tableProps.columnResizing,
    selectableCells: singleRowChildrenConfig.tableProps.selectableCells,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });
}
