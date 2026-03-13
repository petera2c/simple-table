/**
 * CellRenderer Example – vanilla port of React CellRenderer.
 */
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

const CELL_RENDERER_DATA: Row[] = [
  { id: 1, name: "John Doe", age: 28, role: "Developer", department: "Engineering", startDate: "2020-01-01" },
  { id: 2, name: "Jane Smith", age: 32, role: "Designer", department: "Design", startDate: "2020-01-01" },
  { id: 3, name: "Bob Johnson", age: 45, role: "Manager", department: "Management", startDate: "2020-01-01" },
  { id: 4, name: "Alice Williams", age: 24, role: "Intern", department: "Internship", startDate: "2020-01-01" },
  { id: 5, name: "Charlie Brown", age: 37, role: "DevOps", department: "Engineering", startDate: "2020-01-01" },
];

const cellStyles: Record<string, Record<string, string>> = {
  id: { backgroundColor: "rgb(255, 0, 0)", width: "100%", overflow: "hidden" },
  name: { backgroundColor: "rgb(0, 0, 255)", width: "100%", overflow: "hidden" },
  age: { backgroundColor: "rgb(0, 128, 0)", width: "100%" },
  role: { backgroundColor: "rgb(255, 255, 0)" },
};

const headerStyles: Record<string, Record<string, string>> = {
  id: { backgroundColor: "rgb(139, 0, 0)", color: "rgb(255, 255, 255)", padding: "4px 8px", borderRadius: "4px", fontWeight: "700" },
  name: { backgroundColor: "rgb(0, 0, 139)", color: "rgb(255, 255, 255)", padding: "4px 8px", borderRadius: "4px", fontStyle: "italic" },
  age: { backgroundColor: "rgb(0, 100, 0)", color: "rgb(255, 255, 255)", padding: "4px 8px", borderRadius: "4px", textTransform: "uppercase" },
  role: { backgroundColor: "rgb(255, 165, 0)", color: "rgb(255, 255, 255)", padding: "4px 8px", borderRadius: "4px", border: "2px solid rgb(255, 140, 0)" },
};

const HEADERS: HeaderObject[] = [
  {
    accessor: "id",
    label: "ID",
    width: 80,
    isSortable: true,
    cellRenderer: ({ accessor, row }: { accessor: string; row: Record<string, unknown> }) => {
      const div = document.createElement("div");
      div.textContent = String(row[accessor] ?? "");
      Object.assign(div.style, cellStyles.id);
      return div;
    },
    headerRenderer: () => {
      const div = document.createElement("div");
      div.textContent = "🆔 ID";
      Object.assign(div.style, headerStyles.id);
      return div;
    },
  },
  {
    accessor: "name",
    label: "Name",
    width: 100,
    isSortable: true,
    cellRenderer: ({ accessor, row }: { accessor: string; row: Record<string, unknown> }) => {
      const div = document.createElement("div");
      div.textContent = String(row[accessor] ?? "");
      Object.assign(div.style, cellStyles.name);
      return div;
    },
    headerRenderer: () => {
      const div = document.createElement("div");
      div.textContent = "👤 Name";
      Object.assign(div.style, headerStyles.name);
      return div;
    },
  },
  {
    accessor: "age",
    label: "Age",
    width: 100,
    isSortable: true,
    cellRenderer: ({ accessor, row }: { accessor: string; row: Record<string, unknown> }) => {
      const div = document.createElement("div");
      div.textContent = String(row[accessor] ?? "");
      Object.assign(div.style, cellStyles.age);
      return div;
    },
    headerRenderer: () => {
      const div = document.createElement("div");
      div.textContent = "🎂 Age";
      Object.assign(div.style, headerStyles.age);
      return div;
    },
  },
  {
    accessor: "role",
    label: "Role",
    width: 150,
    isSortable: true,
    cellRenderer: ({ accessor, row }: { accessor: string; row: Record<string, unknown> }) => {
      const div = document.createElement("div");
      div.textContent = String(row[accessor] ?? "");
      Object.assign(div.style, cellStyles.role);
      return div;
    },
    headerRenderer: () => {
      const div = document.createElement("div");
      div.textContent = "💼 Role";
      Object.assign(div.style, headerStyles.role);
      return div;
    },
  },
];

export const cellRendererExampleDefaults = {
  columnReordering: true,
  columnResizing: true,
  selectableCells: true,
};

export function renderCellRendererExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...cellRendererExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(HEADERS, CELL_RENDERER_DATA, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Cell Renderer";
  return wrapper;
}
