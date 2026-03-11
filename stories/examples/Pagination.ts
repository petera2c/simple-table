/**
 * Pagination Example – vanilla port of React Pagination.
 */
import { renderVanillaTable } from "../utils";
import { generateSaaSData } from "../data/saas-data";
import { SAAS_HEADERS } from "../data/saas-data";

const ROWS_PER_PAGE = 10;

export function renderPaginationExample(): HTMLElement {
  const data = generateSaaSData();
  const { wrapper, h2 } = renderVanillaTable(
    SAAS_HEADERS,
    data,
    {
      shouldPaginate: true,
      rowsPerPage: ROWS_PER_PAGE,
      columnReordering: true,
      columnResizing: true,
      selectableCells: true,
      selectableColumns: true,
      theme: "dark",
      height: "500px",
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "Pagination";
  const p = document.createElement("p");
  p.style.marginBottom = "1rem";
  p.style.color = "#666";
  p.textContent = "Client-side pagination with 10 rows per page.";
  wrapper.insertBefore(p, wrapper.querySelector("div:last-child"));
  return wrapper;
}
