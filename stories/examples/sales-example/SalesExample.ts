/**
 * SalesExample – vanilla port of React sales-example/SalesExample.
 */
import type { HeaderObject, Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "product", label: "Product", width: 200 },
  { accessor: "revenue", label: "Revenue", width: 120 },
  { accessor: "region", label: "Region", width: 120 },
];

const ROWS: Row[] = [
  { id: 1, product: "Widget A", revenue: 12500, region: "North" },
  { id: 2, product: "Widget B", revenue: 8300, region: "South" },
  { id: 3, product: "Widget C", revenue: 15200, region: "East" },
];

export function renderSalesExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    columnResizing: true,
    columnReordering: true,
    selectableCells: true,
    theme: "modern-dark",
    height: "70dvh",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Sales Example";
  return wrapper;
}
