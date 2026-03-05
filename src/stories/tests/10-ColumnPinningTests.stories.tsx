import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect } from "@storybook/test";
import { Row, SimpleTable } from "../..";
import { HeaderObject } from "../..";

// ============================================================================
// DATA INTERFACES
// ============================================================================

const createEmployeeData = (): Row[] => {
  return [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      department: "Engineering",
      position: "Senior Engineer",
      salary: 120000,
      startDate: "2020-01-15",
      projects: 5,
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      department: "Design",
      position: "Lead Designer",
      salary: 95000,
      startDate: "2019-03-22",
      projects: 3,
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      department: "Engineering",
      position: "Staff Engineer",
      salary: 140000,
      startDate: "2018-07-10",
      projects: 8,
    },
    {
      id: 4,
      name: "Diana Prince",
      email: "diana@example.com",
      department: "Marketing",
      position: "Marketing Manager",
      salary: 110000,
      startDate: "2021-05-01",
      projects: 4,
    },
    {
      id: 5,
      name: "Eve Adams",
      email: "eve@example.com",
      department: "Sales",
      position: "Sales Director",
      salary: 105000,
      startDate: "2020-09-15",
      projects: 6,
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

const getHeaderSections = (canvasElement: HTMLElement) => {
  return {
    left: canvasElement.querySelector(".st-header-pinned-left") as HTMLElement | null,
    main: canvasElement.querySelector(".st-header-main") as HTMLElement | null,
    right: canvasElement.querySelector(".st-header-pinned-right") as HTMLElement | null,
  };
};

const getBodySections = (canvasElement: HTMLElement) => {
  return {
    left: canvasElement.querySelector(".st-body-pinned-left") as HTMLElement | null,
    main: canvasElement.querySelector(".st-body-main") as HTMLElement | null,
    right: canvasElement.querySelector(".st-body-pinned-right") as HTMLElement | null,
  };
};

const getHeaderCellsInSection = (section: HTMLElement | null): HTMLElement[] => {
  if (!section) return [];
  return Array.from(section.querySelectorAll(".st-header-cell"));
};

const getFlexShrink = (element: HTMLElement | null): string => {
  if (!element) return "";
  return window.getComputedStyle(element).flexShrink;
};

const hasBorder = (element: HTMLElement | null, side: "left" | "right"): boolean => {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  const borderProp = side === "left" ? style.borderLeftWidth : style.borderRightWidth;
  return parseFloat(borderProp) > 0;
};

// ============================================================================
// STORYBOOK META
// ============================================================================

const meta: Meta<typeof SimpleTable> = {
  title: "Tests/10-ColumnPinningTests",
  component: SimpleTable,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof SimpleTable>;

// ============================================================================
// TEST CASES
// ============================================================================

/**
 * Test 1: Left Pinned Column
 * Tests that a column with pinned="left" renders in the left pinned section
 */
export const LeftPinnedColumn: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, pinned: "left", type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];

    return (
      <div style={{ padding: "20px", width: "600px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row?.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerSections = getHeaderSections(canvasElement);

    // Verify left pinned section exists
    expect(headerSections.left).toBeTruthy();

    // Verify left pinned section has the name column
    const leftHeaderCells = getHeaderCellsInSection(headerSections.left);
    expect(leftHeaderCells.length).toBe(1);

    // Verify main section has the other columns
    const mainHeaderCells = getHeaderCellsInSection(headerSections.main);
    expect(mainHeaderCells.length).toBe(3);

    // Verify right pinned section doesn't exist (no right-pinned columns)
    expect(headerSections.right).toBeNull();

    // Verify left section has flex-shrink: 0 (fixed width)
    expect(getFlexShrink(headerSections.left)).toBe("0");

    // Verify left section has a right border
    expect(hasBorder(headerSections.left, "right")).toBe(true);
  },
};

/**
 * Test 2: Right Pinned Column
 * Tests that a column with pinned="right" renders in the right pinned section
 */
export const RightPinnedColumn: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "projects", label: "Projects", width: 100, pinned: "right", type: "number" },
    ];

    return (
      <div style={{ padding: "20px", width: "600px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row?.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerSections = getHeaderSections(canvasElement);

    // Verify right pinned section exists
    expect(headerSections.right).toBeTruthy();

    // Verify right pinned section has the projects column
    const rightHeaderCells = getHeaderCellsInSection(headerSections.right);
    expect(rightHeaderCells.length).toBe(1);

    // Verify main section has the other columns
    const mainHeaderCells = getHeaderCellsInSection(headerSections.main);
    expect(mainHeaderCells.length).toBe(3);

    // Verify left pinned section doesn't exist (no left-pinned columns)
    expect(headerSections.left).toBeNull();

    // Verify right section has flex-shrink: 0 (fixed width)
    expect(getFlexShrink(headerSections.right)).toBe("0");

    // Verify right section has a left border
    expect(hasBorder(headerSections.right, "left")).toBe(true);
  },
};

/**
 * Test 3: Both Left and Right Pinned Columns
 * Tests that columns can be pinned to both left and right simultaneously
 */
export const BothLeftAndRightPinned: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, pinned: "left", type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
      { accessor: "projects", label: "Projects", width: 100, pinned: "right", type: "number" },
    ];

    return (
      <div style={{ padding: "20px", width: "700px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row?.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerSections = getHeaderSections(canvasElement);

    // Verify all three sections exist
    expect(headerSections.left).toBeTruthy();
    expect(headerSections.main).toBeTruthy();
    expect(headerSections.right).toBeTruthy();

    // Verify column distribution
    const leftHeaderCells = getHeaderCellsInSection(headerSections.left);
    expect(leftHeaderCells.length).toBe(1);

    const mainHeaderCells = getHeaderCellsInSection(headerSections.main);
    expect(mainHeaderCells.length).toBe(3);

    const rightHeaderCells = getHeaderCellsInSection(headerSections.right);
    expect(rightHeaderCells.length).toBe(1);

    // Verify both pinned sections have flex-shrink: 0
    expect(getFlexShrink(headerSections.left)).toBe("0");
    expect(getFlexShrink(headerSections.right)).toBe("0");

    // Verify borders
    expect(hasBorder(headerSections.left, "right")).toBe(true);
    expect(hasBorder(headerSections.right, "left")).toBe(true);
  },
};

/**
 * Test 4: Multiple Left Pinned Columns
 * Tests that multiple columns can be pinned to the left
 */
export const MultipleLeftPinnedColumns: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, pinned: "left", type: "number" },
      { accessor: "name", label: "Name", width: 150, pinned: "left", type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];

    return (
      <div style={{ padding: "20px", width: "700px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row?.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerSections = getHeaderSections(canvasElement);

    // Verify left pinned section has 2 columns
    const leftHeaderCells = getHeaderCellsInSection(headerSections.left);
    expect(leftHeaderCells.length).toBe(2);

    // Verify main section has the remaining columns
    const mainHeaderCells = getHeaderCellsInSection(headerSections.main);
    expect(mainHeaderCells.length).toBe(3);

    // Verify the order of left pinned columns (ID, then Name)
    expect(leftHeaderCells[0].textContent).toContain("ID");
    expect(leftHeaderCells[1].textContent).toContain("Name");
  },
};

/**
 * Test 5: Multiple Right Pinned Columns
 * Tests that multiple columns can be pinned to the right
 */
export const MultipleRightPinnedColumns: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, pinned: "right", type: "number" },
      { accessor: "projects", label: "Projects", width: 100, pinned: "right", type: "number" },
    ];

    return (
      <div style={{ padding: "20px", width: "700px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row?.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerSections = getHeaderSections(canvasElement);

    // Verify right pinned section has 2 columns
    const rightHeaderCells = getHeaderCellsInSection(headerSections.right);
    expect(rightHeaderCells.length).toBe(2);

    // Verify main section has the remaining columns
    const mainHeaderCells = getHeaderCellsInSection(headerSections.main);
    expect(mainHeaderCells.length).toBe(3);

    // Verify the order of right pinned columns (Salary, then Projects)
    expect(rightHeaderCells[0].textContent).toContain("Salary");
    expect(rightHeaderCells[1].textContent).toContain("Projects");
  },
};

/**
 * Test 6: Pinned Columns with Body Sections
 * Tests that body sections match header sections for pinned columns
 */
export const PinnedColumnsWithBodySections: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, pinned: "left", type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "projects", label: "Projects", width: 100, pinned: "right", type: "number" },
    ];

    return (
      <div style={{ padding: "20px", width: "600px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row?.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerSections = getHeaderSections(canvasElement);
    const bodySections = getBodySections(canvasElement);

    // Verify header sections exist
    expect(headerSections.left).toBeTruthy();
    expect(headerSections.main).toBeTruthy();
    expect(headerSections.right).toBeTruthy();

    // Verify body sections match header sections
    expect(bodySections.left).toBeTruthy();
    expect(bodySections.main).toBeTruthy();
    expect(bodySections.right).toBeTruthy();

    // Verify body sections have flex-shrink: 0 for pinned sections
    expect(getFlexShrink(bodySections.left)).toBe("0");
    expect(getFlexShrink(bodySections.right)).toBe("0");

    // Verify body sections have borders
    expect(hasBorder(bodySections.left, "right")).toBe(true);
    expect(hasBorder(bodySections.right, "left")).toBe(true);
  },
};

/**
 * Test 7: Pinned Columns with Sorting
 * Tests that pinned columns support sorting
 */
export const PinnedColumnsWithSorting: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      {
        accessor: "name",
        label: "Name",
        width: 150,
        pinned: "left",
        isSortable: true,
        type: "string",
      },
      { accessor: "email", label: "Email", width: 200, isSortable: true, type: "string" },
      {
        accessor: "salary",
        label: "Salary",
        width: 120,
        pinned: "right",
        isSortable: true,
        type: "number",
      },
    ];

    return (
      <div style={{ padding: "20px", width: "600px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row?.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerSections = getHeaderSections(canvasElement);

    // Get pinned column headers
    const leftHeaderCells = getHeaderCellsInSection(headerSections.left);
    const rightHeaderCells = getHeaderCellsInSection(headerSections.right);

    expect(leftHeaderCells.length).toBe(1);
    expect(rightHeaderCells.length).toBe(1);

    // Verify pinned columns are sortable (have clickable class)
    expect(leftHeaderCells[0].classList.contains("clickable")).toBe(true);
    expect(rightHeaderCells[0].classList.contains("clickable")).toBe(true);
  },
};

/**
 * Test 8: Pinned Columns with Filtering
 * Tests that pinned columns support filtering
 */
export const PinnedColumnsWithFiltering: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      {
        accessor: "name",
        label: "Name",
        width: 150,
        pinned: "left",
        filterable: true,
        type: "string",
      },
      { accessor: "email", label: "Email", width: 200, filterable: true, type: "string" },
      {
        accessor: "projects",
        label: "Projects",
        width: 100,
        pinned: "right",
        filterable: true,
        type: "number",
      },
    ];

    return (
      <div style={{ padding: "20px", width: "600px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row?.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerSections = getHeaderSections(canvasElement);

    // Verify pinned sections exist
    expect(headerSections.left).toBeTruthy();
    expect(headerSections.right).toBeTruthy();

    // Get pinned column headers
    const leftHeaderCells = getHeaderCellsInSection(headerSections.left);
    const rightHeaderCells = getHeaderCellsInSection(headerSections.right);

    expect(leftHeaderCells.length).toBe(1);
    expect(rightHeaderCells.length).toBe(1);

    // Verify headers exist (filtering is configured)
    expect(leftHeaderCells[0]).toBeTruthy();
    expect(rightHeaderCells[0]).toBeTruthy();
  },
};

/**
 * Test 9: No Pinned Columns
 * Tests that table works normally without any pinned columns
 */
export const NoPinnedColumns: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
    ];

    return (
      <div style={{ padding: "20px", width: "600px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row?.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerSections = getHeaderSections(canvasElement);

    // Verify only main section exists
    expect(headerSections.main).toBeTruthy();
    expect(headerSections.left).toBeNull();
    expect(headerSections.right).toBeNull();

    // Verify all columns are in main section
    const mainHeaderCells = getHeaderCellsInSection(headerSections.main);
    expect(mainHeaderCells.length).toBe(3);
  },
};

/**
 * Test 10: Pinned Columns with Alignment
 * Tests that pinned columns respect alignment settings
 */
export const PinnedColumnsWithAlignment: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, pinned: "left", align: "center", type: "number" },
      { accessor: "name", label: "Name", width: 150, type: "string" },
      {
        accessor: "salary",
        label: "Salary",
        width: 120,
        pinned: "right",
        align: "right",
        type: "number",
      },
    ];

    return (
      <div style={{ padding: "20px", width: "600px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row?.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerSections = getHeaderSections(canvasElement);

    // Get pinned headers
    const leftHeaderCells = getHeaderCellsInSection(headerSections.left);
    const rightHeaderCells = getHeaderCellsInSection(headerSections.right);

    expect(leftHeaderCells.length).toBe(1);
    expect(rightHeaderCells.length).toBe(1);

    // Verify alignment classes are applied
    const leftHeaderLabel = leftHeaderCells[0].querySelector(".st-header-label-text");
    expect(leftHeaderLabel?.classList.contains("center-aligned")).toBe(true);

    const rightHeaderLabel = rightHeaderCells[0].querySelector(".st-header-label-text");
    expect(rightHeaderLabel?.classList.contains("right-aligned")).toBe(true);
  },
};
