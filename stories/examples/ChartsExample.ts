/**
 * Charts Example – vanilla port of React ChartsExample.
 */
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "metric", label: "Metric", width: 200 },
  { accessor: "value", label: "Value", width: 120 },
  { accessor: "trend", label: "Trend", width: 100 },
];

const ROWS: Row[] = [
  { id: 1, metric: "Revenue", value: 125000, trend: "up" },
  { id: 2, metric: "Users", value: 5400, trend: "up" },
  { id: 3, metric: "Churn", value: 2.1, trend: "down" },
];

export const chartsExampleDefaults = { height: "300px" };

export function renderChartsExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...chartsExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Charts";
  return wrapper;
}
