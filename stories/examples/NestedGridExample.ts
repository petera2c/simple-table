/**
 * NestedGrid Example – vanilla port of React NestedGridExample.
 */
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 200 },
  { accessor: "children", label: "Children", width: 120 },
];

const ROWS: Row[] = [
  { id: 1, name: "Parent 1", children: 3 },
  { id: 2, name: "Parent 2", children: 2 },
  { id: 3, name: "Parent 3", children: 1 },
];

export function renderNestedGridExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    expandable: true,
    height: "300px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Nested Grid";
  return wrapper;
}
