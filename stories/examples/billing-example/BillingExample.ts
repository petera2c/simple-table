/**
 * BillingExample – vanilla port of React billing-example/BillingExample.
 * Uses same headers and data as React, with row grouping by invoices and charges.
 */
import type { Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { BILLING_HEADERS } from "./billing-headers";
import billingData from "./billing-data.json";

export function renderBillingExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(
    BILLING_HEADERS,
    billingData as Row[],
    {
      columnReordering: true,
      columnResizing: true,
      editColumns: true,
      selectableCells: true,
      height: "70dvh",
      initialSortColumn: "amount",
      initialSortDirection: "desc",
      useOddColumnBackground: true,
      rowGrouping: ["invoices", "charges"],
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "Billing Example";
  return wrapper;
}
