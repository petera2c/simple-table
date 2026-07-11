/**
 * SelectableCells Example – vanilla port of React SelectableCells.
 */
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import { generateRetailSalesData } from "../data/retail-data";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";

export const selectableCellsExampleDefaults = {
  rowGrouping: ["stores"] as const,
  selectableCells: true,
  selectableColumns: true,
  columnResizing: true,
  columnReordering: true,
  height: "80vh",
  customTheme: { rowHeight: 20, headerHeight: 20 },
};

export function renderSelectableCellsExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...selectableCellsExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(RETAIL_SALES_HEADERS, generateRetailSalesData(), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Selectable Cells";
  return wrapper;
}
