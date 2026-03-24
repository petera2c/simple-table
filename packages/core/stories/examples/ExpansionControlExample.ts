/**
 * ExpansionControl Example – vanilla port of React ExpansionControlExample.
 */
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import { generateRetailSalesData } from "../data/retail-data";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";

export const expansionControlExampleDefaults = {
  rowGrouping: ["stores"] as const,
  height: "400px",
};

export function renderExpansionControlExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...expansionControlExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(RETAIL_SALES_HEADERS, generateRetailSalesData(), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Expansion Control";
  return wrapper;
}
