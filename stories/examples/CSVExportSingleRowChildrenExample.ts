/**
 * CSVExportSingleRowChildren Example – vanilla port of React CSVExportSingleRowChildrenExample.
 */
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import { generateRetailSalesData } from "../data/retail-data";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";

export const csvExportSingleRowChildrenExampleDefaults = {
  rowGrouping: ["stores"] as const,
  height: "400px",
};

export function renderCSVExportSingleRowChildrenExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...csvExportSingleRowChildrenExampleDefaults, ...args };
  const { wrapper, h2, table } = renderVanillaTable(RETAIL_SALES_HEADERS, generateRetailSalesData(), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "CSV Export Single Row Children";
  const btn = document.createElement("button");
  btn.textContent = "Export to CSV";
  btn.type = "button";
  btn.style.marginBottom = "1rem";
  wrapper.insertBefore(btn, wrapper.querySelector("div:last-child"));
  btn.addEventListener("click", () => table.getAPI().exportToCSV());
  return wrapper;
}
