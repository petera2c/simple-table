/**
 * PaginationAPI Example – vanilla port of React PaginationAPIExample.
 */
import { SimpleTableVanilla } from "../../dist/index.es.js";
import { renderVanillaTable } from "../utils";
import { generateSaaSData } from "../data/saas-data";
import { SAAS_HEADERS } from "../data/saas-data";

export function renderPaginationAPIExample(): HTMLElement {
  const data = generateSaaSData();
  const { wrapper, h2, table } = renderVanillaTable(
    SAAS_HEADERS as Record<string, unknown>[],
    data as Record<string, unknown>[],
    {
      shouldPaginate: true,
      rowsPerPage: 10,
      height: "400px",
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "Pagination API";
  const btn = document.createElement("button");
  btn.textContent = "Go to page 2";
  btn.type = "button";
  btn.style.marginBottom = "1rem";
  wrapper.insertBefore(btn, wrapper.querySelector("div:last-child"));
  btn.addEventListener("click", () => {
    const api = table.getAPI();
    if (api.setPage) api.setPage(2);
  });
  return wrapper;
}
