/**
 * ManufacturingExample – vanilla port of React manufacturing/ManufacturingExample.
 * Uses same manufacturing headers and data, with rowGrouping by stations.
 */
import type { Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { MANUFACTURING_HEADERS } from "./manufacturing-headers";
import manufacturingData from "./manufacturing-data.json";

export function renderManufacturingExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(
    MANUFACTURING_HEADERS,
    manufacturingData as Row[],
    {
      columnResizing: true,
      columnReordering: true,
      selectableCells: true,
      rowGrouping: ["stations"],
      expandAll: false,
      height: "70dvh",
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "Manufacturing Example";
  return wrapper;
}
