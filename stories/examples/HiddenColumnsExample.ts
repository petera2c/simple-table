/**
 * HiddenColumns Example – vanilla port of React HiddenColumnsExample.
 */
import { renderVanillaTable } from "../utils";
import { generateSpaceData } from "../data/space-data";
import { SPACE_HEADERS } from "../data/space-data";

export function renderHiddenColumnsExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(
    SPACE_HEADERS as Record<string, unknown>[],
    generateSpaceData() as Record<string, unknown>[],
    {
      columnResizing: true,
      columnReordering: true,
      editColumns: true,
      editColumnsInitOpen: true,
      height: "80vh",
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "Hidden Columns (Edit Columns)";
  return wrapper;
}
