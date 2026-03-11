/**
 * HeaderInclusion Example – vanilla port of React HeaderInclusionExample.
 */
import type { HeaderObject } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { createBasicData } from "./BasicExample";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "age", label: "Age", width: 100 },
  { accessor: "role", label: "Role", width: 150 },
];

export function renderHeaderInclusionExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, createBasicData(20), {
    height: "400px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Header Inclusion";
  return wrapper;
}
