/**
 * AutoExpandColumns Example – vanilla port of React AutoExpandColumnsExample.
 */
import type { HeaderObject } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import { createBasicData } from "./BasicExample";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: "1fr", minWidth: 80 },
  { accessor: "age", label: "Age", width: 100 },
  { accessor: "role", label: "Role", width: 150 },
];

export const autoExpandColumnsExampleDefaults = {
  autoExpandColumns: true,
  columnResizing: true,
  height: "400px",
};

export function renderAutoExpandColumnsExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...autoExpandColumnsExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(HEADERS, createBasicData(50), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Auto Expand Columns";
  return wrapper;
}
