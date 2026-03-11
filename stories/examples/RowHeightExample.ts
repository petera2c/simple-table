/**
 * RowHeight Example – vanilla port of React RowHeightExample.
 */
import { renderVanillaTable } from "../utils";

const ROWS = [
  { id: 1, name: "John Doe", age: 28, role: "Developer" },
  { id: 2, name: "Jane Smith", age: 32, role: "Designer" },
  { id: 3, name: "Bob Johnson", age: 45, role: "Manager" },
];

const HEADERS: Record<string, unknown>[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "age", label: "Age", width: 100 },
  { accessor: "role", label: "Role", width: 150 },
];

export function renderRowHeightExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    customTheme: { rowHeight: 24, headerHeight: 24 },
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Row Height";
  return wrapper;
}
