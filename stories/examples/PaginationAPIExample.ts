/**
 * PaginationAPI Example – vanilla port of React PaginationAPIExample.
 */
import { renderVanillaTable, addParagraph } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import { generateSaaSData } from "../data/saas-data";
import { SAAS_HEADERS } from "../data/saas-data";

export const paginationAPIExampleDefaults = {
  shouldPaginate: true,
  rowsPerPage: 10,
  height: "400px",
  theme: "modern-dark" as const,
};

export function renderPaginationAPIExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const data = generateSaaSData();
  const options = { ...defaultVanillaArgs, ...paginationAPIExampleDefaults, ...args };
  const { wrapper, h2, tableContainer, table } = renderVanillaTable(SAAS_HEADERS, data, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Pagination API Example";
  addParagraph(
    wrapper,
    "Control pagination programmatically via the table API: setPage(), getCurrentPage(), getTotalPages().",
    tableContainer
  );
  const btn = document.createElement("button");
  btn.textContent = "Go to page 2";
  btn.type = "button";
  btn.style.marginBottom = "1rem";
  wrapper.insertBefore(btn, tableContainer);
  btn.addEventListener("click", () => {
    const api = table.getAPI();
    if (api.setPage) api.setPage(2);
  });
  return wrapper;
}
