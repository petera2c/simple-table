import { SimpleTableVanilla } from "simple-table-core";
import type { ChartsProduct } from "./charts.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { chartsConfig } from "./charts.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<ChartsProduct>) => row.id;
export function renderChartsDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<ChartsProduct> {
  return new SimpleTableVanilla(container, {
    getRowId,
    columnReordering: chartsConfig.tableProps.columnReordering,
    columnResizing: chartsConfig.tableProps.columnResizing,
    columns: chartsConfig.headers,
    rows: chartsConfig.rows,
    selectableCells: chartsConfig.tableProps.selectableCells,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });
}
