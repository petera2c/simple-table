/**
 * FinancialExample – vanilla port of React finance-example/FinancialExample.
 * Uses same finance headers and data as React (live-update behavior is React-only).
 */
import type { Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";
import { FINANCE_HEADERS } from "./finance-headers";
import financeData from "./finance-data.json";

export const financeExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  height: "90dvh",
};

export function renderFinanceExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...financeExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(FINANCE_HEADERS, financeData as Row[], {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Finance Example";
  return wrapper;
}
