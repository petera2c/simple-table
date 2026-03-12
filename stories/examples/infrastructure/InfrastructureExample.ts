/**
 * InfrastructureExample – vanilla port of React infrastructure/InfrastructureExample.
 * Uses same infrastructure headers and data shape as React.
 */
import type { Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { INFRASTRUCTURE_HEADERS } from "./infrastructure-headers";
import { INFRASTRUCTURE_DATA } from "./infrastructure-data";

export function renderInfrastructureExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(
    INFRASTRUCTURE_HEADERS,
    INFRASTRUCTURE_DATA as Row[],
    {
      columnResizing: true,
      columnReordering: true,
      selectableCells: true,
      height: "70dvh",
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "Infrastructure Example";
  return wrapper;
}
