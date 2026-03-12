/**
 * SalesExample – vanilla port of React sales-example/SalesExample.
 * Uses same SALES_HEADERS and sales-data as React, with autoExpandColumns and enableRowSelection.
 */
import type { Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { SALES_HEADERS } from "./sales-headers";
import salesData from "./sales-data.json";

export function renderSalesExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(
    SALES_HEADERS,
    salesData as Row[],
    {
      columnResizing: true,
      columnReordering: true,
      selectableCells: true,
      autoExpandColumns: true,
      enableRowSelection: true,
      theme: "modern-dark",
      height: "70dvh",
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "Sales Example";
  return wrapper;
}
