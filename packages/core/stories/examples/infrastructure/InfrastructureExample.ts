/**
 * InfrastructureExample – vanilla port of React infrastructure/InfrastructureExample.
 * Uses same infrastructure headers and data shape as React.
 */
import type { Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";
import { INFRASTRUCTURE_HEADERS } from "./infrastructure-headers";
import { INFRASTRUCTURE_DATA } from "./infrastructure-data";

export const infrastructureExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  height: "70dvh",
};

export function renderInfrastructureExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...infrastructureExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(INFRASTRUCTURE_HEADERS, INFRASTRUCTURE_DATA as Row[], {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Infrastructure Example";
  return wrapper;
}
