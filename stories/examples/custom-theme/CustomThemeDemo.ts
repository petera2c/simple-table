/**
 * CustomTheme Demo – vanilla port of React custom-theme/CustomThemeDemo.
 */
import { renderVanillaTable } from "../../utils";

const HEADERS: Record<string, unknown>[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", minWidth: 100, width: "1fr", type: "string" },
  { accessor: "email", label: "Email", minWidth: 100, width: "1fr", type: "string" },
  { accessor: "department", label: "Department", minWidth: 100, width: "1fr", type: "string" },
  { accessor: "status", label: "Status", width: 120, type: "string" },
];

const ROWS: Record<string, unknown>[] = [
  { id: 1, name: "Chef Antoine", email: "antoine@example.com", department: "Kitchen", status: "Active" },
  { id: 2, name: "Sofia Guerrero", email: "sofia@example.com", department: "Front", status: "Active" },
  { id: 3, name: "Marco Benedetti", email: "marco@example.com", department: "Wine", status: "Active" },
];

export function renderCustomThemeExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Custom Theme";
  return wrapper;
}
