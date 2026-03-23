/**
 * ColumnVisibilityAPI Example – vanilla port of React ColumnVisibilityAPIExample.
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
];

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60 },
  { accessor: "name", label: "Name", width: 140 },
  { accessor: "age", label: "Age", width: 80 },
  { accessor: "department", label: "Department", width: 120 },
  { accessor: "salary", label: "Salary", width: 100 },
  { accessor: "status", label: "Status", width: 90 },
];

export const columnVisibilityAPIExampleDefaults = {
  editColumns: true,
  columnResizing: true,
  height: "400px",
};

export function renderColumnVisibilityAPIExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...columnVisibilityAPIExampleDefaults, ...args };
  const { wrapper, h2, tableContainer, table } = renderVanillaTable(HEADERS, SAMPLE_DATA, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });

  h2.textContent = "Column Visibility API Example";

  const statusDiv = document.createElement("div");
  statusDiv.style.padding = "10px";
  statusDiv.style.marginBottom = "15px";
  statusDiv.style.backgroundColor = "#d4edda";
  statusDiv.style.color = "#155724";
  statusDiv.style.border = "1px solid #c3e6cb";
  statusDiv.style.borderRadius = "4px";
  statusDiv.style.minHeight = "1.5rem";
  statusDiv.style.display = "none";
  wrapper.insertBefore(statusDiv, tableContainer);

  const showStatus = (message: string) => {
    statusDiv.textContent = message;
    statusDiv.style.display = "block";
  };

  addParagraph(
    wrapper,
    "Use the column editor (edit columns control) or the buttons below to show or hide columns programmatically via the table API.",
    tableContainer
  );

  const api = table.getAPI();
  addControlPanel(
    wrapper,
    [
      {
        heading: "Column Visibility Presets:",
        buttons: [
          {
            label: "Basic Info (ID, Name, Age)",
            onClick: async () => {
              await api.applyColumnVisibility({
                id: true,
                name: true,
                age: true,
                department: false,
                salary: false,
                status: false,
              });
              showStatus("Showing basic info columns");
            },
          },
          {
            label: "All Columns",
            onClick: async () => {
              await api.applyColumnVisibility({
                id: true,
                name: true,
                age: true,
                department: true,
                salary: true,
                status: true,
              });
              showStatus("Showing all columns");
            },
          },
        ],
      },
      {
        heading: "Individual Column Control:",
        buttons: [
          {
            label: "Hide Age",
            onClick: async () => {
              await api.applyColumnVisibility({ age: false });
              showStatus("Age column hidden");
            },
          },
          {
            label: "Show Salary",
            onClick: async () => {
              await api.applyColumnVisibility({ salary: true });
              showStatus("Salary column shown");
            },
          },
        ],
      },
    ],
    tableContainer
  );

  return wrapper;
}
