/**
 * RowSelection Example – vanilla port of React RowSelectionExample.
 * Same data, headers, and props as React version.
 */
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";

const ROWS: Row[] = [
  { id: 1, name: "John Doe", age: 28, role: "Developer", department: "Engineering", startDate: "2020-01-01", status: "Active" },
  { id: 2, name: "Jane Smith", age: 32, role: "Designer", department: "Design", startDate: "2019-03-15", status: "Active" },
  { id: 3, name: "Bob Johnson", age: 45, role: "Manager", department: "Management", startDate: "2018-07-20", status: "Active" },
  { id: 4, name: "Alice Williams", age: 24, role: "Intern", department: "Internship", startDate: "2023-01-10", status: "Active" },
  { id: 5, name: "Charlie Brown", age: 37, role: "DevOps", department: "Engineering", startDate: "2021-05-12", status: "Active" },
  { id: 6, name: "Diana Prince", age: 29, role: "Developer", department: "Engineering", startDate: "2022-02-28", status: "Inactive" },
  { id: 7, name: "Ethan Hunt", age: 31, role: "Developer", department: "Engineering", startDate: "2021-09-15", status: "Active" },
  { id: 8, name: "Frank Underwood", age: 40, role: "Team Lead", department: "Engineering", startDate: "2020-11-03", status: "Active" },
  { id: 9, name: "Grace Hopper", age: 35, role: "Senior Developer", department: "Engineering", startDate: "2019-08-22", status: "Active" },
  { id: 10, name: "Hannah Montana", age: 22, role: "Junior Developer", department: "Engineering", startDate: "2023-06-01", status: "Active" },
];

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, isSortable: true, filterable: true },
  { accessor: "name", label: "Name", minWidth: 120, width: "1fr", isSortable: true, filterable: true },
  { accessor: "age", label: "Age", width: 80, isSortable: true, filterable: true },
  { accessor: "role", label: "Role", width: 140, isSortable: true, filterable: true },
  { accessor: "department", label: "Department", width: 120, isSortable: true, filterable: true },
  {
    accessor: "status",
    label: "Status",
    width: 100,
    isSortable: true,
    filterable: true,
    cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
      const span = document.createElement("span");
      span.textContent = String(row.status ?? "");
      span.style.color = row.status === "Active" ? "green" : "orange";
      span.style.fontWeight = "bold";
      return span;
    },
  },
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
