/**
 * ServerSidePagination Example – vanilla port of React ServerSidePaginationExample.
 */
import { SimpleTableVanilla } from "../../src/index";
import type { Row } from "../../src/index";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import { generateSaaSData } from "../data/saas-data";
import { SAAS_HEADERS } from "../data/saas-data";

const ROWS_PER_PAGE = 10;

function generateLargeDataset(): Row[] {
  const base = generateSaaSData();
  const out: Row[] = [];
  for (let i = 0; i < 3; i++) {
    base.forEach((row, index) => {
      out.push({ ...row, id: i * base.length + index });
    });
  }
  return out;
}

const TOTAL_DATA = generateLargeDataset();

function fetchPage(page: number, pageSize: number): Promise<{ rows: Row[]; totalCount: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const offset = (page - 1) * pageSize;
      resolve({
        rows: TOTAL_DATA.slice(offset, offset + pageSize),
        totalCount: TOTAL_DATA.length,
      });
    }, 300);
  });
}

export function renderServerSidePaginationExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.padding = "2rem";
  const h2 = document.createElement("h2");
  h2.textContent = "Server-Side Pagination Example";
  h2.style.marginBottom = "0.5rem";
  wrapper.appendChild(h2);
  const p = document.createElement("p");
  p.style.color = "#666";
  p.style.marginBottom = "1rem";
  p.innerHTML = "True server-side pagination: API returns only the requested page (offset/limit).";
  wrapper.appendChild(p);
  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);

  const options = { ...defaultVanillaArgs, ...args };
  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: SAAS_HEADERS,
    rows: TOTAL_DATA.slice(0, ROWS_PER_PAGE),
    shouldPaginate: true,
    rowsPerPage: ROWS_PER_PAGE,
    serverSidePagination: true,
    totalRowCount: TOTAL_DATA.length,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    onPageChange: (page: number) => {
      fetchPage(page, ROWS_PER_PAGE).then(({ rows, totalCount }) => {
        table.update({ rows, totalRowCount: totalCount });
      });
    },
    ...options,
  });
  table.mount();
  return wrapper;
}
