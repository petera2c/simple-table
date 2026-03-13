/**
 * DynamicNestedTable Example – vanilla port of React DynamicNestedTableExample.
 */
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 200 },
  { accessor: "count", label: "Count", width: 100 },
];

const ROWS: Row[] = [
  { id: 1, name: "Group A", count: 10 },
  { id: 2, name: "Group B", count: 20 },
  { id: 3, name: "Group C", count: 15 },
];

export const dynamicNestedTableExampleDefaults = { height: "300px" };

export function renderDynamicNestedTableExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...dynamicNestedTableExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Dynamic Nested Table";
  return wrapper;
}
