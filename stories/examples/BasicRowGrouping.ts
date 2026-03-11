/**
 * BasicRowGrouping Example – vanilla port of React BasicRowGrouping.
 */
import { renderVanillaTable } from "../utils";
import { generateRetailSalesData } from "../data/retail-data";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";

export function renderBasicRowGroupingExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(
    RETAIL_SALES_HEADERS as Record<string, unknown>[],
    generateRetailSalesData() as Record<string, unknown>[],
    {
      rowGrouping: ["stores"],
      height: "calc(100dvh - 112px)",
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "Basic Row Grouping";
  return wrapper;
}
