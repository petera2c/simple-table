/**
 * SelectableCells Example – vanilla port of React SelectableCells.
 */
import { renderVanillaTable } from "../utils";
import { generateRetailSalesData } from "../data/retail-data";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";

export function renderSelectableCellsExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(
    RETAIL_SALES_HEADERS as Record<string, unknown>[],
    generateRetailSalesData() as Record<string, unknown>[],
    {
      rowGrouping: ["stores"],
      selectableCells: true,
      selectableColumns: true,
      columnResizing: true,
      columnReordering: true,
      height: "80vh",
      customTheme: { rowHeight: 20, headerHeight: 20 },
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "Selectable Cells";
  return wrapper;
}
