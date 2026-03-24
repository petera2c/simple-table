/**
 * DynamicHeaders Example – vanilla port of React DynamicHeadersExample.
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

export const dynamicHeadersExampleDefaults = { height: "400px" };

export function renderDynamicHeadersExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...dynamicHeadersExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(HEADERS, createBasicData(25), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Dynamic Headers";
  return wrapper;
}
