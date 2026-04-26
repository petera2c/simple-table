/**
 * Basic Example – vanilla port of React BasicExample.
 */
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";
import type { HeaderObject, Row } from "../../src/index";

const roles = ["Developer", "Designer", "Manager", "Intern", "DevOps", "Engineer"];
const departments = ["Engineering", "Design", "Management", "Internship"];

export const basicExampleDefaults = {
  columnResizing: true,
  editColumns: true,
  selectableCells: true,
  columnReordering: true,
  height: "500px",
  useOddEvenRowBackground: true,
};

export function createBasicData(rowLength: number): Row[] {
  return Array.from({ length: rowLength }, (_, index) => ({
    id: index + 1,
    name: `Name ${index + 1}`,
    age: Math.floor(Math.random() * 100),
    role: roles[Math.floor(Math.random() * roles.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
  }));
}

export function renderBasicExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const headers: HeaderObject[] = [
    { accessor: "id", label: "ID", width: 80, isSortable: true, filterable: true },
    {
      accessor: "name",
      label: "Name",
      minWidth: 80,
      width: "1fr",
      isSortable: true,
      filterable: true,
    },
    { accessor: "age", label: "Age", width: 100, isSortable: true, filterable: true },
    { accessor: "role", label: "Role", width: 150, isSortable: true, filterable: true },
  ];
  const options = { ...defaultVanillaArgs, ...basicExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(headers, createBasicData(100), {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Basic Example";
  return wrapper;
}
