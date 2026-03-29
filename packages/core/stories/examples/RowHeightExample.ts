/**
 * RowHeight Example – vanilla port of React RowHeightExample.
 */
import type { HeaderObject } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

const ROWS = [
  { id: 1, name: "John Doe", age: 28, role: "Developer" },
  { id: 2, name: "Jane Smith", age: 32, role: "Designer" },
  { id: 3, name: "Bob Johnson", age: 45, role: "Manager" },
];

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "age", label: "Age", width: 100 },
  { accessor: "role", label: "Role", width: 150 },
];

export const rowHeightExampleDefaults = {
  customTheme: { rowHeight: 24, headerHeight: 24 },
};

export function renderRowHeightExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...rowHeightExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Row Height";
  return wrapper;
}
