import { SimpleTableVanilla } from "simple-table-core";
import type { AggregateFunctionsRow } from "./aggregate-functions.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { aggregateFunctionsConfig } from "./aggregate-functions.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<AggregateFunctionsRow>) => row.id;
export function renderAggregateFunctionsDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<AggregateFunctionsRow> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: aggregateFunctionsConfig.headers,
    rows: aggregateFunctionsConfig.rows,
    rowGrouping: aggregateFunctionsConfig.tableProps.rowGrouping,
    columnResizing: true,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });
  return table;
}
