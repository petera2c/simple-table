/**
 * Charts Example – vanilla port of React ChartsExample.
 */
import { renderVanillaTable } from "../utils";

const HEADERS: Record<string, unknown>[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "metric", label: "Metric", width: 200 },
  { accessor: "value", label: "Value", width: 120 },
  { accessor: "trend", label: "Trend", width: 100 },
];

const ROWS: Record<string, unknown>[] = [
  { id: 1, metric: "Revenue", value: 125000, trend: "up" },
  { id: 2, metric: "Users", value: 5400, trend: "up" },
  { id: 3, metric: "Churn", value: 2.1, trend: "down" },
];

export function renderChartsExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    height: "300px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Charts";
  return wrapper;
}
