/**
 * EditableCells Example – vanilla port of React EditableCells.
 * Same headers, data, and props as React version.
 */
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";

const HEADERS: HeaderObject[] = [
  {
    accessor: "status",
    label: "Status",
    width: 130,
    isEditable: true,
    type: "enum",
    enumOptions: [
      { label: "New", value: "New" },
      { label: "In Progress", value: "In Progress" },
      { label: "Completed", value: "Completed" },
      { label: "On Hold", value: "On Hold" },
      { label: "Cancelled", value: "Cancelled" },
    ],
  },
  { accessor: "id", label: "ID", width: 80, isEditable: false, type: "number" },
  { accessor: "firstName", label: "First Name", width: 150, isEditable: true, type: "string" },
  { accessor: "lastName", label: "Last Name", width: 150, isEditable: true, type: "string" },
  { accessor: "email", label: "Email", minWidth: 100, width: "1fr", isEditable: true, type: "string" },
  {
    accessor: "role",
    label: "Role",
    width: 150,
    isEditable: true,
    type: "enum",
    enumOptions: [
      { label: "Developer", value: "Developer" },
      { label: "Designer", value: "Designer" },
      { label: "Manager", value: "Manager" },
      { label: "Marketing", value: "Marketing" },
      { label: "QA", value: "QA" },
    ],
  },
  { accessor: "hireDate", label: "Hire Date", width: 150, isEditable: true, type: "date" },
  { accessor: "isActive", label: "Active", width: 100, isEditable: true, type: "boolean" },
  { accessor: "salary", label: "Salary", width: 120, isEditable: true, type: "number" },
  { accessor: "reviewDate", label: "Next Review", width: 150, isEditable: true, type: "date" },
];

const ROWS: Row[] = [
  { id: 1, status: "Completed", firstName: "John", lastName: "Doe", email: "john@example.com", role: "Developer", hireDate: "2020-01-15", isActive: true, salary: 85000, reviewDate: "2023-08-15" },
  { id: 2, status: "In Progress", firstName: "Jane", lastName: "Smith", email: "jane@example.com", role: "Designer", hireDate: "2021-03-22", isActive: true, salary: 78000, reviewDate: "2023-09-22" },
  { id: 3, status: "Completed", firstName: "Bob", lastName: "Johnson", email: "bob@example.com", role: "Manager", hireDate: "2019-11-05", isActive: true, salary: 92000, reviewDate: "2023-07-05" },
  { id: 4, status: "On Hold", firstName: "Alice", lastName: "Williams", email: "alice@example.com", role: "Developer", hireDate: "2022-01-10", isActive: false, salary: 83000, reviewDate: "2023-03-10" },
  { id: 5, status: "New", firstName: "Charlie", lastName: "Brown", email: "charlie@example.com", role: "Marketing", hireDate: "2021-08-17", isActive: true, salary: 76000, reviewDate: "2023-03-17" },
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
