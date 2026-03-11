/**
 * RowSelection Example – vanilla port of React RowSelectionExample.
 */
import { renderVanillaTable } from "../utils";

const ROWS = [
  { id: 1, name: "John Doe", age: 28, role: "Developer", department: "Engineering", startDate: "2020-01-01", status: "Active" },
  { id: 2, name: "Jane Smith", age: 32, role: "Designer", department: "Design", startDate: "2019-03-15", status: "Active" },
  { id: 3, name: "Bob Johnson", age: 45, role: "Manager", department: "Management", startDate: "2018-07-20", status: "Active" },
  { id: 4, name: "Alice Williams", age: 24, role: "Intern", department: "Internship", startDate: "2023-01-10", status: "Active" },
  { id: 5, name: "Charlie Brown", age: 37, role: "DevOps", department: "Engineering", startDate: "2021-05-12", status: "Active" },
  { id: 6, name: "Diana Prince", age: 29, role: "Developer", department: "Engineering", startDate: "2022-02-28", status: "Inactive" },
  { id: 7, name: "Ethan Hunt", age: 31, role: "Developer", department: "Engineering", startDate: "2020-11-01", status: "Active" },
];

const HEADERS: Record<string, unknown>[] = [
  { accessor: "id", label: "ID", width: 60 },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "age", label: "Age", width: 80 },
  { accessor: "role", label: "Role", width: 120 },
  { accessor: "department", label: "Department", width: 140 },
  { accessor: "startDate", label: "Start Date", width: 120 },
  { accessor: "status", label: "Status", width: 100 },
];

export function renderRowSelectionExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    columnResizing: true,
    editColumns: true,
    selectableCells: true,
    columnReordering: true,
    enableRowSelection: true,
    height: "400px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Row Selection";
  return wrapper;
}
