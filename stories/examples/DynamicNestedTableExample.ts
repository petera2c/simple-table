/**
 * DynamicNestedTable Example – vanilla port of React DynamicNestedTableExample.
 */
import { renderVanillaTable } from "../utils";

const HEADERS: Record<string, unknown>[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 200 },
  { accessor: "count", label: "Count", width: 100 },
];

const ROWS: Record<string, unknown>[] = [
  { id: 1, name: "Group A", count: 10 },
  { id: 2, name: "Group B", count: 20 },
  { id: 3, name: "Group C", count: 15 },
];

export function renderDynamicNestedTableExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    expandable: true,
    height: "300px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Dynamic Nested Table";
  return wrapper;
}
