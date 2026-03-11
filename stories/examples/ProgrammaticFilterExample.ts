/**
 * ProgrammaticFilter Example – vanilla port of React ProgrammaticFilterExample.
 */
import { renderVanillaTable } from "../utils";
import { createBasicData } from "./BasicExample";

const HEADERS: Record<string, unknown>[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "age", label: "Age", width: 100 },
  { accessor: "role", label: "Role", width: 150 },
];

export function renderProgrammaticFilterExample(): HTMLElement {
  const { wrapper, h2, table } = renderVanillaTable(HEADERS, createBasicData(30), {
    filterable: true,
    height: "400px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Programmatic Filter";
  const btn = document.createElement("button");
  btn.textContent = "Filter role = Developer";
  btn.type = "button";
  btn.style.marginBottom = "1rem";
  wrapper.insertBefore(btn, wrapper.querySelector("div:last-child"));
  btn.addEventListener("click", () => {
    const api = table.getAPI();
    if (api.applyFilter) api.applyFilter({ accessor: "role", operator: "equals", value: "Developer" });
  });
  return wrapper;
}
