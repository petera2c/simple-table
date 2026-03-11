/**
 * ExpansionControl Example – vanilla port of React ExpansionControlExample.
 */
import { renderVanillaTable } from "../utils";
import { generateRetailSalesData } from "../data/retail-data";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";

export function renderExpansionControlExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(
    RETAIL_SALES_HEADERS as Record<string, unknown>[],
    generateRetailSalesData() as Record<string, unknown>[],
    {
      rowGrouping: ["stores"],
      expandable: true,
      height: "400px",
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "Expansion Control";
  return wrapper;
}
