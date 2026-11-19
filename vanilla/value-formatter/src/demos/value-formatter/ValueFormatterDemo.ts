import { SimpleTableVanilla } from "simple-table-core";
import type { FormattedEmployee } from "./value-formatter.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { valueFormatterConfig } from "./value-formatter.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<FormattedEmployee>) => row.id;
export function renderValueFormatterDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<FormattedEmployee> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: valueFormatterConfig.headers,
    rows: valueFormatterConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    selectableCells: valueFormatterConfig.tableProps.selectableCells,
  });
  return table;
}
