/**
 * ColumnWidthChange Example – vanilla port of React ColumnWidthChangeExample.
 */
import type { HeaderObject } from "../../src/index";
import { renderVanillaTable, addParagraph } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import { createBasicData } from "./BasicExample";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 200 },
  { accessor: "age", label: "Age", width: 100 },
  { accessor: "role", label: "Role", width: 150 },
];

export const columnWidthChangeExampleDefaults = {
  columnResizing: true,
  height: "400px",
};

export function renderColumnWidthChangeExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...columnWidthChangeExampleDefaults, ...args };
  const { wrapper, h2, tableContainer } = renderVanillaTable(HEADERS, createBasicData(30), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Column Width Change Example";
  addParagraph(
    wrapper,
    "Resize columns by dragging the resize handles or double-click the resize handle to auto-size. The onColumnWidthChange callback will be triggered with the updated headers. Column widths can be persisted (e.g. to localStorage) and restored on page reload.",
    tableContainer
  );
  return wrapper;
}
