/**
 * CELL EDITING TESTS
 * Ported from React - same tests, vanilla table only.
 */

import { HeaderObject, SimpleTableVanilla } from "../../src/index";
import { expect, userEvent } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { addParagraph } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/06 - Cell Editing",
  parameters: {
    layout: "fullscreen",
    options: { showPanel: false },
    tags: ["test"],
  },
};

export default meta;

// ============================================================================
// TEST DATA
// ============================================================================

const createEmployeeData = () => [
  { id: 1, firstName: "Alice", lastName: "Johnson", email: "alice@example.com", salary: 120000, isActive: true, hireDate: "2020-01-15", role: "Developer", department: "Engineering" },
  { id: 2, firstName: "Bob", lastName: "Smith", email: "bob@example.com", salary: 95000, isActive: true, hireDate: "2021-03-20", role: "Designer", department: "Design" },
  { id: 3, firstName: "Charlie", lastName: "Brown", email: "charlie@example.com", salary: 140000, isActive: false, hireDate: "2019-07-10", role: "Manager", department: "Engineering" },
];

// ============================================================================
// TEST UTILITIES
// ============================================================================

const getCellElement = (canvasElement: HTMLElement, rowIndex: number, accessor: string): Element | null => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return null;
  return bodyContainer.querySelector(`.st-cell[data-row-index="${rowIndex}"][data-accessor="${accessor}"]`);
};

const getCellContent = (cell: Element | null) => {
  const contentSpan = cell?.querySelector(".st-cell-content");
  return contentSpan?.textContent || "";
};

const doubleClickCell = async (cell: Element) => {
  const user = userEvent.setup();
  await user.dblClick(cell);
};

const findInputInCell = (canvasElement: HTMLElement) => {
  const editingDiv = canvasElement.querySelector(".st-cell-editing");
  if (editingDiv) return editingDiv.querySelector("input");
  return canvasElement.querySelector("input");
};

// ============================================================================
// STORIES
// ============================================================================

export const BasicStringEditing = {
  render: () => {
    let data = createEmployeeData();
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "Basic String Editing";
    wrapper.appendChild(h2);
    addParagraph(wrapper, "Double-click on First Name or Last Name cells to edit them");
    const editInfoDiv = document.createElement("div");
    editInfoDiv.setAttribute("data-testid", "edit-info");
    editInfoDiv.style.marginBottom = "1rem";
    editInfoDiv.style.padding = "0.5rem";
    editInfoDiv.style.background = "#f0f0f0";
    editInfoDiv.style.borderRadius = "4px";
    wrapper.appendChild(editInfoDiv);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers:HeaderObject[]   = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "firstName", label: "First Name", width: 150, isEditable: true, type: "string" },
      { accessor: "lastName", label: "Last Name", width: 150, isEditable: true, type: "string" },
      { accessor: "email", label: "Email", width: 200 },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: data,
      height: "300px",
      onCellEdit: (props) => {
        data = data.map((row) =>
          row.id === props.row.id ? { ...row, [props.accessor]: props.newValue } : row
        );
        table.update({ rows: data });
        editInfoDiv.textContent = `Last Edit: ${props.accessor} = ${props.newValue}`;
        editInfoDiv.style.display = "block";
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    const firstNameCell = getCellElement(canvasElement, 0, "firstName");
    if (!firstNameCell) throw new Error("First name cell not found");
    expect(getCellContent(firstNameCell)).toBe("Alice");
    await doubleClickCell(firstNameCell);
    await new Promise((r) => setTimeout(r, 200));
    const input = findInputInCell(canvasElement);
    if (!input) throw new Error("Input field not found after double-click");
    expect(input.value).toBe("Alice");
    await user.clear(input);
    await user.type(input, "Alicia");
    await user.keyboard("{Enter}");
    await new Promise((r) => setTimeout(r, 500));
    const updatedCell = getCellElement(canvasElement, 0, "firstName");
    if (!updatedCell) throw new Error("Updated cell not found");
    expect(getCellContent(updatedCell)).toBe("Alicia");
    const editInfo = canvasElement.querySelector('[data-testid="edit-info"]');
    expect(editInfo?.textContent).toContain("firstName = Alicia");
  },
};

export const NumberEditing = {
  render: () => {
    let data = createEmployeeData();
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.textContent = "Number Editing";
    wrapper.appendChild(h2);
    addParagraph(wrapper, "Double-click on Salary cells to edit them (numeric input only)");
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers:HeaderObject[]   = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "firstName", label: "First Name", width: 150 },
      { accessor: "salary", label: "Salary", width: 150, isEditable: true, type: "number" },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: data,
      height: "300px",
      onCellEdit: (props) => {
        data = data.map((row) =>
          row.id === props.row.id ? { ...row, [props.accessor]: Number(props.newValue) } : row
        );
        table.update({ rows: data });
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    const salaryCell = getCellElement(canvasElement, 0, "salary");
    if (!salaryCell) throw new Error("Salary cell not found");
    expect(getCellContent(salaryCell)).toBe("120000");
    await doubleClickCell(salaryCell);
    await new Promise((r) => setTimeout(r, 200));
    const input = findInputInCell(canvasElement);
    if (!input) throw new Error("Input field not found");
    await user.clear(input);
    await user.type(input, "125000");
    await user.keyboard("{Enter}");
    await new Promise((r) => setTimeout(r, 500));
    const updatedCell = getCellElement(canvasElement, 0, "salary");
    if (!updatedCell) throw new Error("Updated cell not found");
    expect(getCellContent(updatedCell)).toBe("125000");
  },
};

export const BooleanEditing = {
  render: () => {
    let data = createEmployeeData();
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.textContent = "Boolean Editing";
    wrapper.appendChild(h2);
    addParagraph(wrapper, "Double-click on Active cells to select True/False from dropdown");
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers:HeaderObject[]   = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "firstName", label: "First Name", width: 150 },
      { accessor: "isActive", label: "Active", width: 100, isEditable: true, type: "boolean" },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: data,
      height: "300px",
      onCellEdit: (props) => {
        data = data.map((row) =>
          row.id === props.row.id
            ? { ...row, [props.accessor]: props.newValue === "true" || props.newValue === true }
            : row
        );
        table.update({ rows: data });
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    const activeCell = getCellElement(canvasElement, 2, "isActive");
    if (!activeCell) throw new Error("Active cell not found");
    expect(getCellContent(activeCell)).toBe("False");
    await doubleClickCell(activeCell);
    await new Promise((r) => setTimeout(r, 300));
    const trueOption = Array.from(document.querySelectorAll(".st-dropdown-item")).find(
      (item) => item.textContent === "True"
    );
    if (!trueOption) throw new Error("True option not found in dropdown");
    await user.click(trueOption);
    await new Promise((r) => setTimeout(r, 500));
    const updatedCell = getCellElement(canvasElement, 2, "isActive");
    if (!updatedCell) throw new Error("Updated cell not found");
    expect(getCellContent(updatedCell)).toBe("True");
  },
};

export const EnumEditing = {
  render: () => {
    let data = createEmployeeData();
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.textContent = "Enum Editing (Dropdown)";
    wrapper.appendChild(h2);
    addParagraph(wrapper, "Double-click on Role cells to select from dropdown options");
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers:HeaderObject[]   = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "firstName", label: "First Name", width: 150 },
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
          { label: "Analyst", value: "Analyst" },
        ],
      },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: data,
      height: "300px",
      onCellEdit: (props) => {
        data = data.map((row) =>
          row.id === props.row.id ? { ...row, [props.accessor]: props.newValue } : row
        );
        table.update({ rows: data });
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    const roleCell = getCellElement(canvasElement, 0, "role");
    if (!roleCell) throw new Error("Role cell not found");
    expect(getCellContent(roleCell)).toBe("Developer");
    await doubleClickCell(roleCell);
    await new Promise((r) => setTimeout(r, 300));
    const managerOption = Array.from(document.querySelectorAll(".st-dropdown-item")).find(
      (item) => item.textContent === "Manager"
    );
    if (!managerOption) throw new Error("Manager option not found in dropdown");
    await user.click(managerOption);
    await new Promise((r) => setTimeout(r, 500));
    const updatedCell = getCellElement(canvasElement, 0, "role");
    if (!updatedCell) throw new Error("Updated cell not found");
    expect(getCellContent(updatedCell)).toBe("Manager");
  },
};

export const DateEditing = {
  render: () => {
    let data = createEmployeeData();
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.textContent = "Date Editing";
    wrapper.appendChild(h2);
    addParagraph(wrapper, "Double-click on Hire Date cells to edit with date picker");
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers:HeaderObject[]   = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "firstName", label: "First Name", width: 150 },
      { accessor: "hireDate", label: "Hire Date", width: 150, isEditable: true, type: "date" },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: data,
      height: "300px",
      onCellEdit: (props) => {
        data = data.map((row) =>
          row.id === props.row.id ? { ...row, [props.accessor]: props.newValue } : row
        );
        table.update({ rows: data });
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const dateCell = getCellElement(canvasElement, 0, "hireDate");
    if (!dateCell) throw new Error("Hire date cell not found");
    expect(getCellContent(dateCell)).toBe("Jan 15, 2020");
    await doubleClickCell(dateCell);
    await new Promise((r) => setTimeout(r, 300));
    const dropdown = document.querySelector(".st-dropdown-content");
    expect(dropdown).toBeTruthy();
  },
};

export const NonEditableColumns = {
  render: () => {
    let data = createEmployeeData();
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.textContent = "Non-Editable Columns";
    wrapper.appendChild(h2);
    addParagraph(wrapper, "Only First Name is editable. ID and Email should not respond to double-click");
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers:HeaderObject[]   = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "firstName", label: "First Name", width: 150, isEditable: true },
      { accessor: "email", label: "Email", width: 200 },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: data,
      height: "300px",
      onCellEdit: (props) => {
        data = data.map((row) =>
          row.id === props.row.id ? { ...row, [props.accessor]: props.newValue } : row
        );
        table.update({ rows: data });
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const idCell = getCellElement(canvasElement, 0, "id");
    if (!idCell) throw new Error("ID cell not found");
    await doubleClickCell(idCell);
    await new Promise((r) => setTimeout(r, 200));
    expect(findInputInCell(canvasElement)).toBeNull();
    const emailCell = getCellElement(canvasElement, 0, "email");
    if (!emailCell) throw new Error("Email cell not found");
    await doubleClickCell(emailCell);
    await new Promise((r) => setTimeout(r, 200));
    expect(findInputInCell(canvasElement)).toBeNull();
    const firstNameCell = getCellElement(canvasElement, 0, "firstName");
    if (!firstNameCell) throw new Error("First name cell not found");
    await doubleClickCell(firstNameCell);
    await new Promise((r) => setTimeout(r, 200));
    expect(findInputInCell(canvasElement)).toBeTruthy();
  },
};

export const EscapeKeyCancelsEdit = {
  render: () => {
    let data = createEmployeeData();
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.textContent = "Escape Key Cancels Edit";
    wrapper.appendChild(h2);
    addParagraph(wrapper, "Edit a cell and press Escape to cancel changes");
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers:HeaderObject[]   = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "firstName", label: "First Name", width: 150, isEditable: true },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: data,
      height: "300px",
      onCellEdit: (props) => {
        data = data.map((row) =>
          row.id === props.row.id ? { ...row, [props.accessor]: props.newValue } : row
        );
        table.update({ rows: data });
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    const firstNameCell = getCellElement(canvasElement, 0, "firstName");
    if (!firstNameCell) throw new Error("First name cell not found");
    expect(getCellContent(firstNameCell)).toBe("Alice");
    await doubleClickCell(firstNameCell);
    await new Promise((r) => setTimeout(r, 200));
    const input = findInputInCell(canvasElement);
    if (!input) throw new Error("Input not found");
    await user.clear(input);
    await user.type(input, "Modified");
    await user.keyboard("{Escape}");
    await new Promise((r) => setTimeout(r, 300));
    expect(getCellContent(firstNameCell)).toBe("Alice");
  },
};

export const OnCellEditCallback = {
  render: () => {
    let data = createEmployeeData();
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.textContent = "onCellEdit Callback Properties";
    wrapper.appendChild(h2);
    addParagraph(wrapper, "Edit cells to see callback information");
    const callbackInfoDiv = document.createElement("div");
    callbackInfoDiv.setAttribute("data-testid", "callback-info");
    callbackInfoDiv.style.marginBottom = "1rem";
    callbackInfoDiv.style.padding = "0.5rem";
    callbackInfoDiv.style.background = "#f0f0f0";
    callbackInfoDiv.style.borderRadius = "4px";
    callbackInfoDiv.style.fontFamily = "monospace";
    callbackInfoDiv.style.fontSize = "0.85rem";
    wrapper.appendChild(callbackInfoDiv);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers:HeaderObject[]     = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "firstName", label: "First Name", width: 150, isEditable: true },
      { accessor: "salary", label: "Salary", width: 150, isEditable: true, type: "number" },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: data,
      height: "300px",
      onCellEdit: (props) => {
        callbackInfoDiv.innerHTML = `
          <div>accessor: ${props.accessor}</div>
          <div>newValue: ${String(props.newValue)}</div>
          <div>row.id: ${props.row.id}</div>
        `;
        callbackInfoDiv.style.display = "block";
        data = data.map((row) =>
          row.id === props.row.id ? { ...row, [props.accessor]: props.newValue } : row
        );
        table.update({ rows: data });
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    const firstNameCell = getCellElement(canvasElement, 0, "firstName");
    if (!firstNameCell) throw new Error("First name cell not found");
    await doubleClickCell(firstNameCell);
    await new Promise((r) => setTimeout(r, 200));
    const input = findInputInCell(canvasElement);
    if (!input) throw new Error("Input not found");
    await user.clear(input);
    await user.type(input, "TestName");
    await user.keyboard("{Enter}");
    await new Promise((r) => setTimeout(r, 300));
    const callbackInfo = canvasElement.querySelector('[data-testid="callback-info"]');
    if (!callbackInfo) throw new Error("Callback info not found");
    expect(callbackInfo.textContent).toContain("accessor: firstName");
    expect(callbackInfo.textContent).toContain("newValue: TestName");
    expect(callbackInfo.textContent).toContain("row.id: 1");
  },
};
