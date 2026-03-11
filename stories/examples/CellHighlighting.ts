/**
 * CellHighlighting Example – vanilla port of React CellHighlighting.
 */
import { renderVanillaTable } from "../utils";

const HEADERS: Record<string, unknown>[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "score", label: "Score", width: 100 },
  { accessor: "status", label: "Status", width: 120 },
];

const ROWS: Record<string, unknown>[] = [
  { id: 1, name: "Alpha", score: 95, status: "Pass" },
  { id: 2, name: "Beta", score: 72, status: "Pass" },
  { id: 3, name: "Gamma", score: 58, status: "Fail" },
  { id: 4, name: "Delta", score: 88, status: "Pass" },
];

export function renderCellHighlightingExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    height: "300px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Cell Highlighting";
  return wrapper;
}
