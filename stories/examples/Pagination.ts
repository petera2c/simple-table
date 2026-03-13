/**
 * Pagination Example – vanilla port of React Pagination.
 */
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import { generateSaaSData } from "../data/saas-data";
import { SAAS_HEADERS } from "../data/saas-data";

const ROWS_PER_PAGE = 10;

export const paginationExampleDefaults = {
  shouldPaginate: true,
  rowsPerPage: ROWS_PER_PAGE,
  columnReordering: true,
  columnResizing: true,
  selectableCells: true,
  selectableColumns: true,
  theme: "modern-dark" as const,
  height: "500px",
};

export function renderPaginationExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const data = generateSaaSData();
  const options = { ...defaultVanillaArgs, ...paginationExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(SAAS_HEADERS, data, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Pagination";
  const p = document.createElement("p");
  p.style.marginBottom = "1rem";
  p.style.color = "#666";
  p.textContent = "Client-side pagination with 10 rows per page.";
  wrapper.insertBefore(p, wrapper.querySelector("div:last-child"));
  return wrapper;
}
