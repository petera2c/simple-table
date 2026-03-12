/**
 * ClayExample – vanilla port of React ClayExample.
 * Same employee table with row selection, column borders, and customTheme.
 */
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";

const CLAY_ROWS: Row[] = [
  { id: 1, name: "John Doe", age: 28, role: "Developer", department: "Engineering", email: "john.doe@company.com", startDate: "2020-01-01", status: "Active", salary: 75000 },
  { id: 2, name: "Jane Smith", age: 32, role: "Designer", department: "Design", email: "jane.smith@company.com", startDate: "2019-03-15", status: "Active", salary: 68000 },
  { id: 3, name: "Bob Johnson", age: 45, role: "Manager", department: "Management", email: "bob.johnson@company.com", startDate: "2018-07-20", status: "Active", salary: 95000 },
  { id: 4, name: "Alice Williams", age: 24, role: "Intern", department: "Internship", email: "alice.williams@company.com", startDate: "2023-01-10", status: "Active", salary: 35000 },
  { id: 5, name: "Charlie Brown", age: 37, role: "DevOps", department: "Engineering", email: "charlie.brown@company.com", startDate: "2021-05-12", status: "Active", salary: 82000 },
  { id: 6, name: "Diana Prince", age: 29, role: "Developer", department: "Engineering", email: "diana.prince@company.com", startDate: "2022-02-28", status: "Inactive", salary: 71000 },
];

const CLAY_HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60 },
  { accessor: "name", label: "Name", minWidth: 120, width: "1fr" },
  { accessor: "role", label: "Role", width: 120 },
  { accessor: "department", label: "Department", width: 120 },
  { accessor: "email", label: "Email", width: 200 },
  { accessor: "startDate", label: "Start Date", width: 120 },
  { accessor: "status", label: "Status", width: 100 },
  {
    accessor: "salary",
    label: "Salary",
    width: 120,
    type: "number",
    valueFormatter: ({ value }: { value?: unknown }) =>
      value != null ? `$${Number(value).toLocaleString()}` : "—",
  },
];

function createRowButton(label: string, title: string): (props: { row: Row }) => HTMLElement {
  return ({ row }) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.title = title;
    btn.type = "button";
    btn.style.cssText = "margin:0 2px;padding:4px 6px;cursor:pointer;font-size:12px;border:1px solid #ddd;border-radius:4px;background:#fff;";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log(`${title} for ${(row as Record<string, unknown>).name} (ID: ${(row as Record<string, unknown>).id})`);
    });
    return btn;
  };
}

export function renderClayExample(): HTMLElement {
  const rowButtons = [
    createRowButton("View", "View Details"),
    createRowButton("Edit", "Edit Employee"),
    createRowButton("Email", "Send Email"),
  ];

  const { wrapper, h2 } = renderVanillaTable(CLAY_HEADERS, CLAY_ROWS, {
    columnResizing: true,
    editColumns: true,
    selectableCells: true,
    columnReordering: true,
    enableRowSelection: true,
    columnBorders: true,
    customTheme: {
      selectionColumnWidth: 160,
    },
    height: "400px",
    rowButtons,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Clay Example";
  return wrapper;
}
