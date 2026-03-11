/**
 * ClayExample – vanilla port of React ClayExample.
 */
import { renderVanillaTable } from "../utils";
import { generateSpaceData } from "../data/space-data";
import { SPACE_HEADERS } from "../data/space-data";

export function renderClayExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(
    SPACE_HEADERS as Record<string, unknown>[],
    generateSpaceData() as Record<string, unknown>[],
    {
      theme: "neutral",
      height: "400px",
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "Clay Example";
  return wrapper;
}
