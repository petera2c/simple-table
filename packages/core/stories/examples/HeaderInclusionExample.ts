/**
 * HeaderInclusion Example – vanilla port of React HeaderInclusionExample.
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

export const headerInclusionExampleDefaults = { height: "400px" };

export function renderHeaderInclusionExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...headerInclusionExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(HEADERS, createBasicData(20), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Header Inclusion";
  return wrapper;
}
