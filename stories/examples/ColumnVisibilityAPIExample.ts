/**
 * ColumnVisibilityAPI Example – vanilla port of React ColumnVisibilityAPIExample.
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

export const columnVisibilityAPIExampleDefaults = {
  editColumns: true,
  height: "400px",
};

export function renderColumnVisibilityAPIExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...columnVisibilityAPIExampleDefaults, ...args };
  const { wrapper, h2, table } = renderVanillaTable(HEADERS, createBasicData(20), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Column Visibility API";
  const btn = document.createElement("button");
  btn.textContent = "Toggle Age Column";
  btn.type = "button";
  btn.style.marginBottom = "1rem";
  wrapper.insertBefore(btn, wrapper.querySelector("div:last-child"));
  btn.addEventListener("click", () => {
    const api = table.getAPI();
    api.applyColumnVisibility({ age: false });
  });
  return wrapper;
}
