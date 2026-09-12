import { SimpleTableVanilla } from "simple-table-core";
import type { TooltipProduct } from "./tooltip.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { tooltipConfig } from "./tooltip.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<TooltipProduct>) => row.id;
export function renderTooltipDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<TooltipProduct> {
  const table = new SimpleTableVanilla(container, {
    getRowId,
    columns: [...tooltipConfig.headers],
    rows: tooltipConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    columnResizing: tooltipConfig.tableProps.columnResizing,
    columnReordering: tooltipConfig.tableProps.columnReordering,
    selectableCells: tooltipConfig.tableProps.selectableCells,
  });
  return table;
}
