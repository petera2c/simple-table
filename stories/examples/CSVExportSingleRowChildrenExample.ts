/**
 * CSVExportSingleRowChildren Example – vanilla port of React CSVExportSingleRowChildrenExample.
 */
import { SimpleTableVanilla } from "../../dist/index.es.js";
import { renderVanillaTable } from "../utils";
import { generateRetailSalesData } from "../data/retail-data";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";

export function renderCSVExportSingleRowChildrenExample(): HTMLElement {
  const { wrapper, h2, table } = renderVanillaTable(
    RETAIL_SALES_HEADERS as Record<string, unknown>[],
    generateRetailSalesData() as Record<string, unknown>[],
    {
      rowGrouping: ["stores"],
      height: "400px",
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "CSV Export Single Row Children";
  const btn = document.createElement("button");
  btn.textContent = "Export to CSV";
  btn.type = "button";
  btn.style.marginBottom = "1rem";
  wrapper.insertBefore(btn, wrapper.querySelector("div:last-child"));
  btn.addEventListener("click", () => table.getAPI().exportToCSV());
  return wrapper;
}
