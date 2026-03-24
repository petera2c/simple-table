/**
 * ProgrammaticFilter Example – vanilla port of React ProgrammaticFilterExample.
 */
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable, addParagraph, addControlPanel } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

const SAMPLE_DATA: Row[] = [
  { id: 1, name: "Alice Johnson", age: 28, department: "Engineering", salary: 95000, status: "Active" },
  { id: 2, name: "Bob Smith", age: 35, department: "Sales", salary: 75000, status: "Active" },
  { id: 3, name: "Charlie Davis", age: 42, department: "Engineering", salary: 110000, status: "Active" },
  { id: 4, name: "Diana Prince", age: 31, department: "Marketing", salary: 82000, status: "Inactive" },
  { id: 5, name: "Ethan Hunt", age: 29, department: "Sales", salary: 78000, status: "Active" },
  { id: 6, name: "Fiona Green", age: 38, department: "Engineering", salary: 105000, status: "Active" },
  { id: 7, name: "George Wilson", age: 26, department: "Marketing", salary: 68000, status: "Active" },
  { id: 8, name: "Hannah Lee", age: 33, department: "Sales", salary: 88000, status: "Inactive" },
  { id: 9, name: "Ian Foster", age: 45, department: "Engineering", salary: 120000, status: "Active" },
  { id: 10, name: "Julia Martinez", age: 27, department: "Marketing", salary: 72000, status: "Active" },
];

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "age", label: "Age", width: 100 },
  { accessor: "department", label: "Department", width: 120 },
  { accessor: "salary", label: "Salary", width: 100 },
  { accessor: "status", label: "Status", width: 100 },
];

export const programmaticFilterExampleDefaults = { height: "400px" };

function formatFilterState(state: Record<string, unknown>): string {
  if (Object.keys(state).length === 0) return "No filters applied.";
  return JSON.stringify(state, null, 2);
}

export function renderProgrammaticFilterExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...programmaticFilterExampleDefaults, ...args };
  const { wrapper, h2, tableContainer, table } = renderVanillaTable(HEADERS, SAMPLE_DATA, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });

  h2.textContent = "Programmatic Filter Control";
  addParagraph(
    wrapper,
    "Use the buttons below to programmatically control table filtering via the table ref API.",
    tableContainer
  );

  const api = table.getAPI();
  const pre = document.createElement("pre");
  pre.style.marginTop = "0.5rem";
  pre.style.marginBottom = "0";
  pre.style.fontSize = "12px";
  pre.style.overflow = "auto";
  pre.style.maxHeight = "80px";
  pre.style.padding = "0.5rem";
  pre.style.background = "#fff";
  pre.style.border = "1px solid #ddd";
  pre.style.borderRadius = "4px";

  const updateFilterState = () => {
    if (api.getFilterState) {
      const state = api.getFilterState();
      pre.textContent = formatFilterState(state as Record<string, unknown>);
    }
  };
  updateFilterState();

  const panel = addControlPanel(
    wrapper,
    [
      {
        heading: "Single Column Filters:",
        buttons: [
          {
            label: "Engineering Dept",
            onClick: async () => {
              if (api.applyFilter) await api.applyFilter({ accessor: "department", operator: "equals", value: "Engineering" });
              updateFilterState();
            },
          },
          {
            label: "Sales Dept",
            onClick: async () => {
              if (api.applyFilter) await api.applyFilter({ accessor: "department", operator: "equals", value: "Sales" });
              updateFilterState();
            },
          },
          {
            label: "Salary > $80k",
            onClick: async () => {
              if (api.applyFilter) await api.applyFilter({ accessor: "salary", operator: "greaterThan", value: 80000 });
              updateFilterState();
            },
          },
          {
            label: "Age 30-40",
            onClick: async () => {
              if (api.applyFilter) await api.applyFilter({ accessor: "age", operator: "between", values: [30, 40] });
              updateFilterState();
            },
          },
          {
            label: 'Name Contains "a"',
            onClick: async () => {
              if (api.applyFilter) await api.applyFilter({ accessor: "name", operator: "contains", value: "a" });
              updateFilterState();
            },
          },
          {
            label: "Active Status",
            onClick: async () => {
              if (api.applyFilter) await api.applyFilter({ accessor: "status", operator: "equals", value: "Active" });
              updateFilterState();
            },
          },
        ],
      },
      {
        heading: "Multiple Filters:",
        buttons: [
          {
            label: "Eng + High Salary",
            onClick: async () => {
              if (api.applyFilter) {
                await api.applyFilter({ accessor: "department", operator: "equals", value: "Engineering" });
                await api.applyFilter({ accessor: "salary", operator: "greaterThan", value: 100000 });
              }
              updateFilterState();
            },
          },
        ],
      },
      {
        heading: "Filter Management:",
        buttons: [
          {
            label: "Get Filter State",
            onClick: () => updateFilterState(),
          },
          {
            label: "Clear Dept Filter",
            onClick: async () => {
              if (api.clearFilter) await api.clearFilter("department");
              updateFilterState();
            },
          },
          {
            label: "Clear All Filters",
            onClick: async () => {
              if (api.clearAllFilters) await api.clearAllFilters();
              updateFilterState();
            },
          },
        ],
      },
    ],
    tableContainer
  );
  const strong = document.createElement("strong");
  strong.textContent = "Current Filter State: ";
  panel.appendChild(strong);
  panel.appendChild(pre);
  return wrapper;
}
