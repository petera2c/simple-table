/**
 * SalesExample – vanilla port of React sales-example/SalesExample.
 * Uses same SALES_HEADERS and sales-data as React, with autoExpandColumns and enableRowSelection.
 */
import type { Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";
import { SALES_HEADERS } from "./sales-headers";
import salesData from "./sales-data.json";

export const salesExampleDefaults = {
  animations: { enabled: true },
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  autoExpandColumns: true,
  enableRowSelection: true,
  theme: "modern-dark" as const,
  height: "70dvh",
};

export function renderSalesExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...salesExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(SALES_HEADERS, salesData as Row[], {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Sales Example";
  return wrapper;
}
