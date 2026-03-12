/**
 * FilterExample – vanilla port of React filter-example/FilterExample.
 * Uses same PRODUCT_HEADERS and filter-data as React.
 */
import type { Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { PRODUCT_HEADERS } from "./filter-headers";
import filterData from "./filter-data.json";

export function renderFilterExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(
    PRODUCT_HEADERS,
    filterData as Row[],
    {
      columnResizing: true,
      columnReordering: true,
      selectableCells: true,
      filterable: true,
      maxHeight: "600px",
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "Filter Example";
  return wrapper;
}
