/**
 * ExternalFilter Example – vanilla port of React ExternalFilterExample.
 */
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "department", label: "Department", width: 140 },
  { accessor: "salary", label: "Salary", width: 100 },
];

const ROWS: Row[] = [
  { id: 1, name: "John", department: "Engineering", salary: 75000 },
  { id: 2, name: "Jane", department: "Marketing", salary: 65000 },
  { id: 3, name: "Bob", department: "Engineering", salary: 85000 },
  { id: 4, name: "Alice", department: "Sales", salary: 70000 },
];

export function renderExternalFilterExample(): HTMLElement {
  const { wrapper, h2, table } = renderVanillaTable(HEADERS, ROWS, {
    filterable: true,
    height: "400px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "External Filter";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Filter by name...";
  input.style.marginBottom = "1rem";
  input.style.padding = "0.5rem";
  wrapper.insertBefore(input, wrapper.querySelector("div:last-child"));
  input.addEventListener("input", () => {
    const api = table.getAPI();
    if (api.applyFilter) api.applyFilter({ accessor: "name", operator: "contains", value: input.value });
  });
  return wrapper;
}
