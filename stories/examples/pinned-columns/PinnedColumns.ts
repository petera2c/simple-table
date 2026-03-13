/**
 * PinnedColumns Example – vanilla port of React pinned-columns/PinnedColumns.
 */
import { renderVanillaTable } from "../../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";
import { generateRetailSalesData } from "../../data/retail-data";
import { RETAIL_SALES_HEADERS } from "../../data/retail-data";

export const pinnedColumnsExampleDefaults = {
  rowGrouping: ["stores"] as const,
  columnReordering: true,
  selectableCells: true,
  selectableColumns: true,
  editColumns: true,
  height: "calc(100dvh - 112px)",
  enableStickyParents: true,
};

export function renderPinnedColumnsExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...pinnedColumnsExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(RETAIL_SALES_HEADERS, generateRetailSalesData(), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Pinned Columns";
  return wrapper;
}
