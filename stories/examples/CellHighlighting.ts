/**
 * CellHighlighting Example – vanilla port of React CellHighlighting.
 */
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "score", label: "Score", width: 100 },
  { accessor: "status", label: "Status", width: 120 },
];

const ROWS: Row[] = [
  { id: 1, name: "Alpha", score: 95, status: "Pass" },
  { id: 2, name: "Beta", score: 72, status: "Pass" },
  { id: 3, name: "Gamma", score: 58, status: "Fail" },
  { id: 4, name: "Delta", score: 88, status: "Pass" },
];

export const cellHighlightingExampleDefaults = { height: "300px" };

export function renderCellHighlightingExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...cellHighlightingExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Cell Highlighting";
  return wrapper;
}
