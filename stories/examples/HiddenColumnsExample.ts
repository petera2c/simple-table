/**
 * HiddenColumns Example – vanilla port of React HiddenColumnsExample.
 */
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import { generateSpaceData } from "../data/space-data";
import { SPACE_HEADERS } from "../data/space-data";

export const hiddenColumnsExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  editColumns: true,
  editColumnsInitOpen: true,
  height: "80vh",
};

export function renderHiddenColumnsExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...hiddenColumnsExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(SPACE_HEADERS, generateSpaceData(), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Hidden Columns (Edit Columns)";
  return wrapper;
}
