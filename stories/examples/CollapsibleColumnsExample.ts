/**
 * CollapsibleColumns Example – vanilla port of React CollapsibleColumnsExample.
 */
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import { SPACE_HEADERS } from "../data/space-data";
import { generateSpaceData } from "../data/space-data";

export const collapsibleColumnsExampleDefaults = { height: "400px" };

export function renderCollapsibleColumnsExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...collapsibleColumnsExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(SPACE_HEADERS, generateSpaceData(), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Collapsible Columns";
  return wrapper;
}
