/**
 * ColumnWidthChange Example – vanilla port of React ColumnWidthChangeExample.
 */
import { renderVanillaTable } from "../utils";
import { createBasicData } from "./BasicExample";

const HEADERS: Record<string, unknown>[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 200 },
  { accessor: "age", label: "Age", width: 100 },
  { accessor: "role", label: "Role", width: 150 },
];

export function renderColumnWidthChangeExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, createBasicData(30), {
    columnResizing: true,
    height: "400px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Column Width Change";
  return wrapper;
}
