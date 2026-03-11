/**
 * LiveUpdates Example – vanilla port of React LiveUpdates.
 */
import { renderVanillaTable } from "../utils";
import { createBasicData } from "./BasicExample";

const HEADERS: Record<string, unknown>[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "age", label: "Age", width: 100 },
  { accessor: "role", label: "Role", width: 150 },
];

export function renderLiveUpdatesExample(): HTMLElement {
  const { wrapper, h2, table } = renderVanillaTable(HEADERS, createBasicData(20), {
    height: "400px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Live Updates";
  const btn = document.createElement("button");
  btn.textContent = "Refresh data";
  btn.type = "button";
  btn.style.marginBottom = "1rem";
  wrapper.insertBefore(btn, wrapper.querySelector("div:last-child"));
  btn.addEventListener("click", () => table.update({ rows: createBasicData(20) }));
  return wrapper;
}
