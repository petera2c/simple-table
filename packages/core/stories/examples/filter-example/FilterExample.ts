/**
 * FilterExample – vanilla port of React filter-example/FilterExample.
 * Uses same PRODUCT_HEADERS and filter-data as React.
 */
import type { Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";
import { PRODUCT_HEADERS } from "./filter-headers";
import filterData from "./filter-data.json";

export const filterExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  maxHeight: "600px",
  theme: "modern-dark" as const,
};

export function renderFilterExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...filterExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(PRODUCT_HEADERS, filterData as Row[], {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Filter Example";
  return wrapper;
}
