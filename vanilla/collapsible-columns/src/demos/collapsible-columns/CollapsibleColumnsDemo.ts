import { SimpleTableVanilla } from "simple-table-core";
import type { CollapsibleSalesRep } from "./collapsible-columns.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { collapsibleColumnsConfig } from "./collapsible-columns.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<CollapsibleSalesRep>) => row.id;
export function renderCollapsibleColumnsDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<CollapsibleSalesRep> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: collapsibleColumnsConfig.headers,
    rows: collapsibleColumnsConfig.rows,
    columnResizing: true,
    enableColumnEditor: true,
    selectableCells: true,
    columnReordering: true,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });
  return table;
}
