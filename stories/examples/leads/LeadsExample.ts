/**
 * LeadsExample – vanilla port of React leads/LeadsExample.
 * Uses same LEADS_HEADERS and leads data as React.
 */
import type { Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { LEADS_HEADERS } from "./leads-headers";
import { LEADS_DATA } from "./leads-data";

export function renderLeadsExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(
    LEADS_HEADERS,
    LEADS_DATA as Row[],
    {
      columnResizing: true,
      columnReordering: true,
      enableRowSelection: true,
      height: "400px",
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    }
  );
  h2.textContent = "Leads Example";
  return wrapper;
}
