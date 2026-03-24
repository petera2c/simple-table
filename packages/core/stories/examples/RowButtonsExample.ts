/**
 * RowButtons Example – vanilla port of React RowButtonsExample.
 */
import type { HeaderObject } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

const ROWS = [
  { id: 1, name: "John Doe", age: 28, role: "Developer", department: "Engineering" },
  { id: 2, name: "Jane Smith", age: 32, role: "Designer", department: "Design" },
  { id: 3, name: "Bob Johnson", age: 45, role: "Manager", department: "Management" },
  { id: 4, name: "Alice Williams", age: 24, role: "Intern", department: "Internship" },
  { id: 5, name: "Charlie Brown", age: 37, role: "DevOps", department: "Engineering" },
];

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60 },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "age", label: "Age", width: 80 },
  { accessor: "role", label: "Role", width: 120 },
  { accessor: "department", label: "Department", width: 140 },
];

export const rowButtonsExampleDefaults = {
  columnResizing: true,
  editColumns: true,
  selectableCells: true,
  columnReordering: true,
  enableRowSelection: true,
  height: "400px",
  customTheme: { selectionColumnWidth: 160 },
  columnBorders: true,
};

export function renderRowButtonsExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...rowButtonsExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Row Buttons";
  return wrapper;
}
