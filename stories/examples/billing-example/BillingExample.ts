/**
 * BillingExample – vanilla port of React billing-example/BillingExample.
 * Uses same headers and data as React, with row grouping by invoices and charges.
 */
import type { Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";
import { BILLING_HEADERS } from "./billing-headers";
import billingData from "./billing-data.json";

export const billingExampleDefaults = {
  columnReordering: true,
  columnResizing: true,
  editColumns: true,
  selectableCells: true,
  height: "70dvh",
  initialSortColumn: "amount" as const,
  initialSortDirection: "desc" as const,
  useOddColumnBackground: true,
  rowGrouping: ["invoices", "charges"] as const,
};

export function renderBillingExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...billingExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(BILLING_HEADERS, billingData as Row[], {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Billing Example";
  return wrapper;
}
