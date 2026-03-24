/**
 * LeadsExample – vanilla port of React leads/LeadsExample.
 * Uses same LEADS_HEADERS and leads data as React.
 */
import type { Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";
import { LEADS_HEADERS } from "./leads-headers";
import { LEADS_DATA } from "./leads-data";

export const leadsExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  enableRowSelection: true,
  height: "400px",
};

export function renderLeadsExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...leadsExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(LEADS_HEADERS, LEADS_DATA as Row[], {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Leads Example";
  return wrapper;
}
