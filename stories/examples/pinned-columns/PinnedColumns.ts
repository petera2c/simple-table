/**
 * PinnedColumns Example – vanilla port of React pinned-columns/PinnedColumns.
 */
import { renderVanillaTable } from "../../utils";
import { generateRetailSalesData } from "../../data/retail-data";
import { RETAIL_SALES_HEADERS } from "../../data/retail-data";

export function renderPinnedColumnsExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(
    RETAIL_SALES_HEADERS,
    generateRetailSalesData(),
    {
      rowGrouping: ["stores"],
      columnReordering: true,
      selectableCells: true,
      selectableColumns: true,
      editColumns: true,
      height: "calc(100dvh - 112px)",
      enableStickyParents: true,
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "Pinned Columns";
  return wrapper;
}
