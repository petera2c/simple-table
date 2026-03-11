/**
 * ExternalSort Example – vanilla port of React ExternalSortExample.
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

export function renderExternalSortExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, createBasicData(30), {
    externalSortHandling: true,
    isSortable: true,
    height: "400px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "External Sort";
  return wrapper;
}
