/**
 * ManufacturingExample – vanilla port of React manufacturing/ManufacturingExample.
 * Uses same manufacturing headers and data, with rowGrouping by stations.
 */
import type { Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";
import { MANUFACTURING_HEADERS } from "./manufacturing-headers";
import manufacturingData from "./manufacturing-data.json";

export const manufacturingExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  rowGrouping: ["stations"] as const,
  expandAll: false,
  height: "70dvh",
};

export function renderManufacturingExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...manufacturingExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(MANUFACTURING_HEADERS, manufacturingData as Row[], {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Manufacturing Example";
  return wrapper;
}
