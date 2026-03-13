/**
 * LiveUpdates Example – vanilla port of React LiveUpdates.
 */
import type { HeaderObject } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import { createBasicData } from "./BasicExample";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "age", label: "Age", width: 100 },
  { accessor: "role", label: "Role", width: 150 },
];

export const liveUpdatesExampleDefaults = { height: "400px" };

export function renderLiveUpdatesExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...liveUpdatesExampleDefaults, ...args };
  const { wrapper, h2, table } = renderVanillaTable(HEADERS, createBasicData(20), {
    ...options,
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
