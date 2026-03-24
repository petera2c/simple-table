/**
 * ProgrammaticSort Example – vanilla port of React ProgrammaticSortExample.
 */
import type { HeaderObject } from "../../src/index";
import { renderVanillaTable, addParagraph } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import { createBasicData } from "./BasicExample";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, isSortable: true },
  { accessor: "name", label: "Name", width: 150, isSortable: true },
  { accessor: "age", label: "Age", width: 100, isSortable: true },
  { accessor: "role", label: "Role", width: 150, isSortable: true },
];

export const programmaticSortExampleDefaults = { height: "400px" };

export function renderProgrammaticSortExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...programmaticSortExampleDefaults, ...args };
  const { wrapper, h2, tableContainer, table } = renderVanillaTable(HEADERS, createBasicData(25), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Programmatic Sort";
  addParagraph(
    wrapper,
    "Set sort state programmatically via the table API: applySortState({ accessor, direction }).",
    tableContainer
  );
  const btn = document.createElement("button");
  btn.textContent = "Sort by age descending";
  btn.type = "button";
  btn.style.marginBottom = "1rem";
  wrapper.insertBefore(btn, tableContainer);
  btn.addEventListener("click", () => {
    const api = table.getAPI();
    api.applySortState({ accessor: "age", direction: "desc" });
  });
  return wrapper;
}
