/**
 * ProgrammaticSort Example – vanilla port of React ProgrammaticSortExample.
 */
import { renderVanillaTable } from "../utils";
import { createBasicData } from "./BasicExample";

const HEADERS: Record<string, unknown>[] = [
  { accessor: "id", label: "ID", width: 80, isSortable: true },
  { accessor: "name", label: "Name", width: 150, isSortable: true },
  { accessor: "age", label: "Age", width: 100, isSortable: true },
  { accessor: "role", label: "Role", width: 150, isSortable: true },
];

export function renderProgrammaticSortExample(): HTMLElement {
  const { wrapper, h2, table } = renderVanillaTable(HEADERS, createBasicData(25), {
    isSortable: true,
    height: "400px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Programmatic Sort";
  const btn = document.createElement("button");
  btn.textContent = "Sort by age descending";
  btn.type = "button";
  btn.style.marginBottom = "1rem";
  wrapper.insertBefore(btn, wrapper.querySelector("div:last-child"));
  btn.addEventListener("click", () => {
    const api = table.getAPI();
    if (api.applySortState) api.applySortState({ column: "age", direction: "desc" });
  });
  return wrapper;
}
