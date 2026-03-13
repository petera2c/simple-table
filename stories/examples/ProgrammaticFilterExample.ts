/**
 * ProgrammaticFilter Example – vanilla port of React ProgrammaticFilterExample.
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

export const programmaticFilterExampleDefaults = { height: "400px" };

export function renderProgrammaticFilterExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...programmaticFilterExampleDefaults, ...args };
  const { wrapper, h2, table } = renderVanillaTable(HEADERS, createBasicData(30), {
    ...options,
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
