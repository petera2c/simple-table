/**
 * EditableCells Example – vanilla port of React EditableCells.
 */
import { renderVanillaTable } from "../utils";

const HEADERS: Record<string, unknown>[] = [
  { accessor: "id", label: "ID", width: 80, isEditable: false, type: "number" },
  { accessor: "firstName", label: "First Name", width: 150, isEditable: true, type: "string" },
  { accessor: "lastName", label: "Last Name", width: 150, isEditable: true, type: "string" },
  { accessor: "email", label: "Email", width: 200, isEditable: true, type: "string" },
  { accessor: "role", label: "Role", width: 120, isEditable: true, type: "string" },
];

const ROWS: Record<string, unknown>[] = [
  { id: 1, firstName: "John", lastName: "Doe", email: "john@example.com", role: "Developer" },
  { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", role: "Designer" },
  { id: 3, firstName: "Bob", lastName: "Johnson", email: "bob@example.com", role: "Manager" },
];

export function renderEditableCellsExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    columnResizing: true,
    columnReordering: true,
    selectableCells: true,
    isEditable: true,
    height: "80vh",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Editable Cells";
  return wrapper;
}
