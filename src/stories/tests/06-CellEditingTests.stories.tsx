import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect, userEvent } from "@storybook/test";
import { SimpleTable } from "../..";
import { HeaderObject } from "../..";

// ============================================================================
// DATA INTERFACES
// ============================================================================

interface Employee extends Record<string, any> {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  salary: number;
  isActive: boolean;
  hireDate: string;
  role: string;
  department: string;
}

// ============================================================================
// TEST DATA
// ============================================================================

const createEmployeeData = (): Employee[] => {
  return [
    {
      id: 1,
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      salary: 120000,
      isActive: true,
      hireDate: "2020-01-15",
      role: "Developer",
      department: "Engineering",
    },
    {
      id: 2,
      firstName: "Bob",
      lastName: "Smith",
      email: "bob@example.com",
      salary: 95000,
      isActive: true,
      hireDate: "2021-03-20",
      role: "Designer",
      department: "Design",
    },
    {
      id: 3,
      firstName: "Charlie",
      lastName: "Brown",
      email: "charlie@example.com",
      salary: 140000,
      isActive: false,
      hireDate: "2019-07-10",
      role: "Manager",
      department: "Engineering",
    },
  ];
};

// ============================================================================
// TEST UTILITIES
// ============================================================================

const waitForTable = async (timeout = 5000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const table = document.querySelector(".simple-table-root");
    if (table) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Table did not render within timeout");
};

const getCellElement = (
  canvasElement: HTMLElement,
  rowIndex: number,
  accessor: string
): HTMLElement | null => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return null;

  const rows = bodyContainer.querySelectorAll(".st-row");
  const row = rows[rowIndex];
  if (!row) return null;

  return row.querySelector(`[data-accessor="${accessor}"]`) as HTMLElement;
};

const getCellContent = (cell: HTMLElement): string => {
  const contentSpan = cell.querySelector(".st-cell-content");
  return contentSpan?.textContent || "";
};

const doubleClickCell = async (cell: HTMLElement) => {
  const user = userEvent.setup();
  await user.dblClick(cell);
};

const findInputInCell = (canvasElement: HTMLElement): HTMLInputElement | null => {
  // For string/number types, input appears in .st-cell-editing div
  const editingDiv = canvasElement.querySelector(".st-cell-editing");
  if (editingDiv) {
    return editingDiv.querySelector("input") as HTMLInputElement;
  }
  // For date type, input might be inside the cell
  return canvasElement.querySelector("input") as HTMLInputElement;
};

// ============================================================================
// STORYBOOK META
// ============================================================================

const meta: Meta = {
  title: "Tests/06 - Cell Editing",
  parameters: {
    layout: "fullscreen",
    options: {
      showPanel: false,
    },
  },
  tags: ["test"],
};

export default meta;

// ============================================================================
// TEST 1: BASIC STRING EDITING
// ============================================================================

export const BasicStringEditing: StoryObj = {
  render: () => {
    const [data, setData] = React.useState(createEmployeeData());
    const [lastEdit, setLastEdit] = React.useState<string>("");

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "firstName", label: "First Name", width: 150, isEditable: true, type: "string" },
      { accessor: "lastName", label: "Last Name", width: 150, isEditable: true, type: "string" },
      { accessor: "email", label: "Email", width: 200 },
    ];

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Basic String Editing</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Double-click on First Name or Last Name cells to edit them
        </p>
        {lastEdit && (
          <div
            data-testid="edit-info"
            style={{
              marginBottom: "1rem",
              padding: "0.5rem",
              background: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            Last Edit: {lastEdit}
          </div>
        )}
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          onCellEdit={(props) => {
            setData((prev) =>
              prev.map((row) =>
                row.id === props.row.id ? { ...row, [props.accessor]: props.newValue } : row
              )
            );
            setLastEdit(`${props.accessor} = ${props.newValue}`);
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    // Get the first name cell in the first row
    const firstNameCell = getCellElement(canvasElement, 0, "firstName");
    if (!firstNameCell) throw new Error("First name cell not found");

    // Verify initial value
    const initialValue = getCellContent(firstNameCell);
    expect(initialValue).toBe("Alice");

    // Double-click to enter edit mode
    await doubleClickCell(firstNameCell);
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Find the input field (it appears in .st-cell-editing div)
    const input = findInputInCell(canvasElement);
    if (!input) throw new Error("Input field not found after double-click");

    // Verify input has the current value
    expect(input.value).toBe("Alice");

    // Clear and type new value
    await user.clear(input);
    await user.type(input, "Alicia");

    // Press Enter to save
    await user.keyboard("{Enter}");
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get the cell again after edit to ensure we have the updated element
    const updatedCell = getCellElement(canvasElement, 0, "firstName");
    if (!updatedCell) throw new Error("Updated cell not found");

    // Verify the value was updated
    const updatedValue = getCellContent(updatedCell);
    expect(updatedValue).toBe("Alicia");

    // Verify the callback was triggered
    const editInfo = canvasElement.querySelector('[data-testid="edit-info"]');
    expect(editInfo?.textContent).toContain("firstName = Alicia");
  },
};

// ============================================================================
// TEST 2: NUMBER EDITING
// ============================================================================

export const NumberEditing: StoryObj = {
  render: () => {
    const [data, setData] = React.useState(createEmployeeData());

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "firstName", label: "First Name", width: 150 },
      { accessor: "salary", label: "Salary", width: 150, isEditable: true, type: "number" },
    ];

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Number Editing</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Double-click on Salary cells to edit them (numeric input only)
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          onCellEdit={(props) => {
            setData((prev) =>
              prev.map((row) =>
                row.id === props.row.id ? { ...row, [props.accessor]: Number(props.newValue) } : row
              )
            );
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    // Get the salary cell in the first row
    const salaryCell = getCellElement(canvasElement, 0, "salary");
    if (!salaryCell) throw new Error("Salary cell not found");

    // Verify initial value
    const initialValue = getCellContent(salaryCell);
    expect(initialValue).toBe("120000");

    // Double-click to enter edit mode
    await doubleClickCell(salaryCell);
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Find the input field
    const input = findInputInCell(canvasElement);
    if (!input) throw new Error("Input field not found");

    // Clear and type new value
    await user.clear(input);
    await user.type(input, "125000");

    // Press Enter to save
    await user.keyboard("{Enter}");
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get the cell again after edit to ensure we have the updated element
    const updatedCell = getCellElement(canvasElement, 0, "salary");
    if (!updatedCell) throw new Error("Updated cell not found");

    // Verify the value was updated
    const updatedValue = getCellContent(updatedCell);
    expect(updatedValue).toBe("125000");
  },
};

// ============================================================================
// TEST 3: BOOLEAN EDITING (CHECKBOX)
// ============================================================================

export const BooleanEditing: StoryObj = {
  render: () => {
    const [data, setData] = React.useState(createEmployeeData());

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "firstName", label: "First Name", width: 150 },
      { accessor: "isActive", label: "Active", width: 100, isEditable: true, type: "boolean" },
    ];

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Boolean Editing</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Double-click on Active cells to select True/False from dropdown
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          onCellEdit={(props) => {
            setData((prev) =>
              prev.map((row) =>
                row.id === props.row.id
                  ? {
                      ...row,
                      [props.accessor]: props.newValue === "true" || props.newValue === true,
                    }
                  : row
              )
            );
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    // Get the isActive cell in the third row (Charlie, initially false)
    const activeCell = getCellElement(canvasElement, 2, "isActive");
    if (!activeCell) throw new Error("Active cell not found");

    // Verify initial value
    const initialValue = getCellContent(activeCell);
    expect(initialValue).toBe("False");

    // Double-click to enter edit mode (opens dropdown)
    await doubleClickCell(activeCell);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Find the dropdown and click "True" option
    const trueOption = Array.from(document.querySelectorAll(".st-dropdown-item")).find(
      (item) => item.textContent === "True"
    ) as HTMLElement;
    if (!trueOption) throw new Error("True option not found in dropdown");

    await user.click(trueOption);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get the cell again and verify the value was updated
    const updatedCell = getCellElement(canvasElement, 2, "isActive");
    if (!updatedCell) throw new Error("Updated cell not found");

    const updatedValue = getCellContent(updatedCell);
    expect(updatedValue).toBe("True");
  },
};

// ============================================================================
// TEST 4: ENUM EDITING (DROPDOWN)
// ============================================================================

export const EnumEditing: StoryObj = {
  render: () => {
    const [data, setData] = React.useState(createEmployeeData());

    const headers: HeaderObject[] = [
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

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Enum Editing (Dropdown)</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Double-click on Role cells to select from dropdown options
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          onCellEdit={(props) => {
            setData((prev) =>
              prev.map((row) =>
                row.id === props.row.id ? { ...row, [props.accessor]: props.newValue } : row
              )
            );
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    // Get the role cell in the first row
    const roleCell = getCellElement(canvasElement, 0, "role");
    if (!roleCell) throw new Error("Role cell not found");

    // Verify initial value
    const initialValue = getCellContent(roleCell);
    expect(initialValue).toBe("Developer");

    // Double-click to enter edit mode (opens dropdown)
    await doubleClickCell(roleCell);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Find the dropdown and click "Manager" option
    const managerOption = Array.from(document.querySelectorAll(".st-dropdown-item")).find(
      (item) => item.textContent === "Manager"
    ) as HTMLElement;
    if (!managerOption) throw new Error("Manager option not found in dropdown");

    await user.click(managerOption);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get the cell again and verify the value was updated
    const updatedCell = getCellElement(canvasElement, 0, "role");
    if (!updatedCell) throw new Error("Updated cell not found");

    const updatedValue = getCellContent(updatedCell);
    expect(updatedValue).toBe("Manager");
  },
};

// ============================================================================
// TEST 5: DATE EDITING
// ============================================================================

export const DateEditing: StoryObj = {
  render: () => {
    const [data, setData] = React.useState(createEmployeeData());

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "firstName", label: "First Name", width: 150 },
      { accessor: "hireDate", label: "Hire Date", width: 150, isEditable: true, type: "date" },
    ];

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Date Editing</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Double-click on Hire Date cells to edit with date picker
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          onCellEdit={(props) => {
            setData((prev) =>
              prev.map((row) =>
                row.id === props.row.id ? { ...row, [props.accessor]: props.newValue } : row
              )
            );
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Get the hireDate cell in the first row
    const dateCell = getCellElement(canvasElement, 0, "hireDate");
    if (!dateCell) throw new Error("Hire date cell not found");

    // Verify initial value (dates are formatted as "Jan 15, 2020")
    const initialValue = getCellContent(dateCell);
    expect(initialValue).toBe("Jan 15, 2020");

    // Double-click to enter edit mode (opens date picker dropdown)
    await doubleClickCell(dateCell);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // The date picker opens in a dropdown - we can verify it exists
    const dropdown = document.querySelector(".st-dropdown-content");
    expect(dropdown).toBeTruthy();

    // Close the dropdown by clicking outside or pressing Escape
    // For this test, we'll just verify the dropdown opened successfully
    // A full date picker interaction would require more complex DOM manipulation

    // Note: Full date picker testing would require interacting with the calendar UI
    // which is complex. For now, we verify the dropdown opens correctly.
  },
};

// ============================================================================
// TEST 6: NON-EDITABLE COLUMNS
// ============================================================================

export const NonEditableColumns: StoryObj = {
  render: () => {
    const [data, setData] = React.useState(createEmployeeData());

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 }, // Not editable
      { accessor: "firstName", label: "First Name", width: 150, isEditable: true },
      { accessor: "email", label: "Email", width: 200 }, // Not editable
    ];

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Non-Editable Columns</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Only First Name is editable. ID and Email should not respond to double-click
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          onCellEdit={(props) => {
            setData((prev) =>
              prev.map((row) =>
                row.id === props.row.id ? { ...row, [props.accessor]: props.newValue } : row
              )
            );
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Try to edit ID cell (should not be editable)
    const idCell = getCellElement(canvasElement, 0, "id");
    if (!idCell) throw new Error("ID cell not found");

    await doubleClickCell(idCell);
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Should not have an input field
    let input = findInputInCell(canvasElement);
    expect(input).toBeNull();

    // Try to edit Email cell (should not be editable)
    const emailCell = getCellElement(canvasElement, 0, "email");
    if (!emailCell) throw new Error("Email cell not found");

    await doubleClickCell(emailCell);
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Should not have an input field
    input = findInputInCell(canvasElement);
    expect(input).toBeNull();

    // Verify First Name IS editable
    const firstNameCell = getCellElement(canvasElement, 0, "firstName");
    if (!firstNameCell) throw new Error("First name cell not found");

    await doubleClickCell(firstNameCell);
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Should have an input field
    input = findInputInCell(canvasElement);
    expect(input).toBeTruthy();
  },
};

// ============================================================================
// TEST 7: ESCAPE KEY CANCELS EDIT
// ============================================================================

export const EscapeKeyCancelsEdit: StoryObj = {
  render: () => {
    const [data, setData] = React.useState(createEmployeeData());

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "firstName", label: "First Name", width: 150, isEditable: true },
    ];

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Escape Key Cancels Edit</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Edit a cell and press Escape to cancel changes
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          onCellEdit={(props) => {
            setData((prev) =>
              prev.map((row) =>
                row.id === props.row.id ? { ...row, [props.accessor]: props.newValue } : row
              )
            );
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    const firstNameCell = getCellElement(canvasElement, 0, "firstName");
    if (!firstNameCell) throw new Error("First name cell not found");

    // Get initial value
    const initialValue = getCellContent(firstNameCell);
    expect(initialValue).toBe("Alice");

    // Enter edit mode
    await doubleClickCell(firstNameCell);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const input = findInputInCell(canvasElement);
    if (!input) throw new Error("Input not found");

    // Type new value
    await user.clear(input);
    await user.type(input, "Modified");

    // Press Escape to cancel
    await user.keyboard("{Escape}");
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Verify value was NOT changed
    const finalValue = getCellContent(firstNameCell);
    expect(finalValue).toBe("Alice");
  },
};

// ============================================================================
// TEST 8: ONCELLEEDIT CALLBACK PROPERTIES
// ============================================================================

export const OnCellEditCallback: StoryObj = {
  render: () => {
    const [data, setData] = React.useState(createEmployeeData());
    const [callbackInfo, setCallbackInfo] = React.useState<any>(null);

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "firstName", label: "First Name", width: 150, isEditable: true },
      { accessor: "salary", label: "Salary", width: 150, isEditable: true, type: "number" },
    ];

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>onCellEdit Callback Properties</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Edit cells to see callback information
        </p>
        {callbackInfo && (
          <div
            data-testid="callback-info"
            style={{
              marginBottom: "1rem",
              padding: "0.5rem",
              background: "#f0f0f0",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "0.85rem",
            }}
          >
            <div>accessor: {callbackInfo.accessor}</div>
            <div>newValue: {String(callbackInfo.newValue)}</div>
            <div>row.id: {callbackInfo.rowId}</div>
          </div>
        )}
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          onCellEdit={(props) => {
            setCallbackInfo({
              accessor: props.accessor,
              newValue: props.newValue,
              rowId: props.row.id,
            });
            setData((prev) =>
              prev.map((row) =>
                row.id === props.row.id ? { ...row, [props.accessor]: props.newValue } : row
              )
            );
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    // Edit first name
    const firstNameCell = getCellElement(canvasElement, 0, "firstName");
    if (!firstNameCell) throw new Error("First name cell not found");

    await doubleClickCell(firstNameCell);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const input = findInputInCell(canvasElement);
    if (!input) throw new Error("Input not found");

    await user.clear(input);
    await user.type(input, "TestName");
    await user.keyboard("{Enter}");
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Verify callback info
    const callbackInfo = canvasElement.querySelector('[data-testid="callback-info"]');
    if (!callbackInfo) throw new Error("Callback info not found");

    expect(callbackInfo.textContent).toContain("accessor: firstName");
    expect(callbackInfo.textContent).toContain("newValue: TestName");
    expect(callbackInfo.textContent).toContain("row.id: 1");
  },
};
