/**
 * QuickFilter Example – vanilla port of React QuickFilterExample.
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

export const quickFilterExampleDefaults = { height: "400px" };

export function renderQuickFilterExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...quickFilterExampleDefaults, ...args };
  const { wrapper, h2, table } = renderVanillaTable(HEADERS, createBasicData(40), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Quick Filter";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Quick filter...";
  input.style.marginBottom = "1rem";
  input.style.padding = "0.5rem";
  input.style.width = "200px";
  wrapper.insertBefore(input, wrapper.querySelector("div:last-child"));
  input.addEventListener("input", () => {
    const api = table.getAPI();
    if (api.applyFilter) api.applyFilter({ accessor: "name", operator: "contains", value: input.value });
  });
  return wrapper;
}
