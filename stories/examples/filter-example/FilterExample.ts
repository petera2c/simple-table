/**
 * FilterExample – vanilla port of React filter-example/FilterExample.
 */
import type { HeaderObject, Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "product", label: "Product", width: 200 },
  { accessor: "category", label: "Category", width: 150 },
  { accessor: "price", label: "Price", width: 100 },
];

const ROWS: Row[] = [
  { id: 1, product: "Laptop", category: "Electronics", price: 999 },
  { id: 2, product: "Mouse", category: "Accessories", price: 29 },
  { id: 3, product: "Keyboard", category: "Electronics", price: 79 },
  { id: 4, product: "Monitor", category: "Electronics", price: 299 },
];

export function renderFilterExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    columnResizing: true,
    columnReordering: true,
    selectableCells: true,
    filterable: true,
    maxHeight: "600px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Filter Example";
  return wrapper;
}
