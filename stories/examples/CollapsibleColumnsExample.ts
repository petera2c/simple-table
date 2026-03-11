/**
 * CollapsibleColumns Example – vanilla port of React CollapsibleColumnsExample.
 */
import { renderVanillaTable } from "../utils";
import { SPACE_HEADERS } from "../data/space-data";
import { generateSpaceData } from "../data/space-data";

export function renderCollapsibleColumnsExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(
    SPACE_HEADERS,
    generateSpaceData(),
    {
      height: "400px",
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "Collapsible Columns";
  return wrapper;
}
