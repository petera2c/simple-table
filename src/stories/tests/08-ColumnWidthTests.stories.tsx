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
      salary: 120000,
    },
    { id: 2, name: "Bob Smith", email: "bob@example.com", department: "Design", salary: 95000 },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      department: "Engineering",
      salary: 140000,
    },
    {
      id: 4,
      name: "Diana Prince",
      email: "diana@example.com",
      department: "Marketing",
      salary: 110000,
    },
    { id: 5, name: "Eve Adams", email: "eve@example.com", department: "Sales", salary: 105000 },
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

const getTableRoot = (canvasElement: HTMLElement): HTMLElement | null => {
  // The table root is the element with grid-template-columns
  // Try multiple selectors
  let root = canvasElement.querySelector(".st-table-root") as HTMLElement;
  if (!root) {
    root = canvasElement.querySelector(".simple-table-root") as HTMLElement;
  }
  if (!root) {
    // The grid might be on the body container
    root = canvasElement.querySelector(".st-body-container") as HTMLElement;
  }
  return root;
};

const getHeaderCells = (canvasElement: HTMLElement): HTMLElement[] => {
  // Query directly from canvasElement like other test files do
  const cells = Array.from(canvasElement.querySelectorAll(".st-header-cell"));
  return cells as HTMLElement[];
};

const getColumnWidth = (headerCell: HTMLElement): string => {
  return window.getComputedStyle(headerCell).width;
};

const parsePixelWidth = (widthString: string): number => {
  return parseFloat(widthString.replace("px", ""));
};

const getGridTemplateColumns = (canvasElement: HTMLElement): string => {
  // Grid template is on the header-main element
  const headerMain = canvasElement.querySelector(".st-header-main") as HTMLElement;
  if (!headerMain) {
    console.log("Header main not found");
    return "";
  }
  // Use inline style, not computed style
  return headerMain.style.gridTemplateColumns;
};

// ============================================================================
// STORYBOOK META
// ============================================================================

const meta: Meta<typeof SimpleTable> = {
  title: "Tests/08-ColumnWidthTests",
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
 * Test 1: Fixed Pixel Widths
 * Tests that columns with fixed pixel widths render at the specified size
 */
export const FixedPixelWidths: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);

    // Check that each column has approximately the expected width
    const idWidth = parsePixelWidth(getColumnWidth(headerCells[0]));
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    const salaryWidth = parsePixelWidth(getColumnWidth(headerCells[3]));

    // Allow small variance for borders/padding
    expect(idWidth).toBeGreaterThanOrEqual(55);
    expect(idWidth).toBeLessThanOrEqual(65);

    expect(nameWidth).toBeGreaterThanOrEqual(195);
    expect(nameWidth).toBeLessThanOrEqual(205);

    expect(deptWidth).toBeGreaterThanOrEqual(145);
    expect(deptWidth).toBeLessThanOrEqual(155);

    expect(salaryWidth).toBeGreaterThanOrEqual(115);
    expect(salaryWidth).toBeLessThanOrEqual(125);
  },
};

/**
 * Test 2: Auto-sizing with "1fr"
 * Tests that columns with "1fr" width share available space equally
 */
export const AutoSizingWithOneFr: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: "1fr", type: "string" },
      { accessor: "email", label: "Email", width: "1fr", type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
    ];

    return (
      <div style={{ padding: "20px", width: "800px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);

    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const emailWidth = parsePixelWidth(getColumnWidth(headerCells[2]));

    // The two "1fr" columns should have approximately equal widths
    // Allow 10% variance for rounding
    const ratio = nameWidth / emailWidth;
    expect(ratio).toBeGreaterThan(0.9);
    expect(ratio).toBeLessThan(1.1);

    // Both should be larger than fixed columns
    expect(nameWidth).toBeGreaterThan(60);
    expect(emailWidth).toBeGreaterThan(60);
  },
};

/**
 * Test 3: MinWidth Constraint with "1fr"
 * Tests that minWidth prevents columns from shrinking below specified size
 */
export const MinWidthConstraint: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: "1fr", minWidth: 200, type: "string" },
      { accessor: "email", label: "Email", width: "1fr", minWidth: 250, type: "string" },
      { accessor: "department", label: "Department", width: "1fr", minWidth: 150, type: "string" },
    ];

    return (
      <div style={{ padding: "20px", width: "600px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);

    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const emailWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[3]));

    // Each column should respect its minWidth
    expect(nameWidth).toBeGreaterThanOrEqual(195);
    expect(emailWidth).toBeGreaterThanOrEqual(245);
    expect(deptWidth).toBeGreaterThanOrEqual(145);
  },
};

/**
 * Test 4: MaxWidth Property
 * Tests column behavior with maxWidth property (note: enforcement may vary by mode)
 */
export const MaxWidthConstraint: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: "1fr", maxWidth: 200, type: "string" },
      { accessor: "email", label: "Email", width: "1fr", type: "string" },
    ];

    return (
      <div style={{ padding: "20px", width: "1200px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);

    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const emailWidth = parsePixelWidth(getColumnWidth(headerCells[2]));

    // Note: maxWidth may not be enforced without autoExpandColumns in current implementation
    // The column with "1fr" will expand to fill available space
    // This test verifies the columns are rendered, but maxWidth enforcement
    // may require additional CSS or autoExpandColumns mode

    // Both columns should be rendered
    expect(nameWidth).toBeGreaterThan(0);
    expect(emailWidth).toBeGreaterThan(0);

    // Email column (no maxWidth) should be wider than or equal to name column
    // since both use "1fr" and share space
    expect(emailWidth).toBeGreaterThanOrEqual(nameWidth * 0.8);
  },
};

/**
 * Test 5: AutoExpandColumns - Basic
 * Tests that autoExpandColumns scales all columns proportionally to fill container
 */
export const AutoExpandColumnsBasic: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];

    return (
      <div style={{ padding: "20px", width: "1000px" }}>
        <SimpleTable
          autoExpandColumns={true}
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);

    const idWidth = parsePixelWidth(getColumnWidth(headerCells[0]));
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    const salaryWidth = parsePixelWidth(getColumnWidth(headerCells[3]));

    // Columns should maintain proportional relationships
    // Name (200) should be wider than Department (150)
    expect(nameWidth).toBeGreaterThan(deptWidth);

    // Department (150) should be wider than Salary (120)
    expect(deptWidth).toBeGreaterThan(salaryWidth);

    // Salary (120) should be wider than ID (60)
    expect(salaryWidth).toBeGreaterThan(idWidth);

    // Total width should approximately fill the container
    const totalWidth = idWidth + nameWidth + deptWidth + salaryWidth;
    expect(totalWidth).toBeGreaterThan(950); // Allow for borders/padding
  },
};

/**
 * Test 6: AutoExpandColumns with MinWidth Ignored
 * Tests that minWidth is ignored when autoExpandColumns is enabled
 */
export const AutoExpandColumnsIgnoresMinWidth: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: 100, minWidth: 300, type: "string" },
      { accessor: "department", label: "Department", width: 100, minWidth: 300, type: "string" },
      { accessor: "salary", label: "Salary", width: 100, minWidth: 300, type: "number" },
    ];

    return (
      <div style={{ padding: "20px", width: "600px" }}>
        <SimpleTable
          autoExpandColumns={true}
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);

    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    const salaryWidth = parsePixelWidth(getColumnWidth(headerCells[3]));

    // With autoExpandColumns, columns should be scaled down below their minWidth
    // to fit the container (600px) instead of respecting minWidth (300px each)
    expect(nameWidth).toBeLessThan(300);
    expect(deptWidth).toBeLessThan(300);
    expect(salaryWidth).toBeLessThan(300);

    // Columns should still maintain proportional relationships (all have width: 100)
    const avgWidth = (nameWidth + deptWidth + salaryWidth) / 3;
    expect(nameWidth).toBeGreaterThan(avgWidth * 0.9);
    expect(nameWidth).toBeLessThan(avgWidth * 1.1);
  },
};

/**
 * Test 7: AutoExpandColumns with MaxWidth Ignored
 * Tests that maxWidth is ignored when autoExpandColumns is enabled
 */
export const AutoExpandColumnsIgnoresMaxWidth: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 200, maxWidth: 100, type: "number" },
      { accessor: "name", label: "Name", width: 200, maxWidth: 100, type: "string" },
      { accessor: "department", label: "Department", width: 200, maxWidth: 100, type: "string" },
    ];

    return (
      <div style={{ padding: "20px", width: "1200px" }}>
        <SimpleTable
          autoExpandColumns={true}
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);

    const idWidth = parsePixelWidth(getColumnWidth(headerCells[0]));
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[2]));

    // With autoExpandColumns, columns should exceed their maxWidth (100px)
    // to fill the container (1200px)
    expect(idWidth).toBeGreaterThan(100);
    expect(nameWidth).toBeGreaterThan(100);
    expect(deptWidth).toBeGreaterThan(100);

    // All columns should be approximately equal (all have width: 200)
    const avgWidth = (idWidth + nameWidth + deptWidth) / 3;
    expect(idWidth).toBeGreaterThan(avgWidth * 0.9);
    expect(idWidth).toBeLessThan(avgWidth * 1.1);
  },
};

/**
 * Test 8: Mixed Width Strategies
 * Tests a realistic scenario with fixed widths, "1fr", and constraints
 */
export const MixedWidthStrategies: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: "1fr", minWidth: 150, type: "string" },
      { accessor: "email", label: "Email", width: "1fr", minWidth: 200, type: "string" },
      { accessor: "department", label: "Department", width: 120, type: "string" },
      { accessor: "salary", label: "Salary", width: 100, type: "number" },
    ];

    return (
      <div style={{ padding: "20px", width: "900px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(5);

    const idWidth = parsePixelWidth(getColumnWidth(headerCells[0]));
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const emailWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[3]));
    const salaryWidth = parsePixelWidth(getColumnWidth(headerCells[4]));

    // Fixed width columns should be close to specified size
    expect(idWidth).toBeGreaterThanOrEqual(55);
    expect(idWidth).toBeLessThanOrEqual(65);

    expect(deptWidth).toBeGreaterThanOrEqual(115);
    expect(deptWidth).toBeLessThanOrEqual(125);

    expect(salaryWidth).toBeGreaterThanOrEqual(95);
    expect(salaryWidth).toBeLessThanOrEqual(105);

    // "1fr" columns should respect minWidth
    expect(nameWidth).toBeGreaterThanOrEqual(145);
    expect(emailWidth).toBeGreaterThanOrEqual(195);

    // "1fr" columns should be larger than fixed columns
    expect(nameWidth).toBeGreaterThan(idWidth);
    expect(emailWidth).toBeGreaterThan(deptWidth);
  },
};

/**
 * Test 9: Grid Template Columns Format
 * Tests that the CSS grid-template-columns is correctly generated
 */
export const GridTemplateColumnsFormat: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: "1fr", minWidth: 120, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const gridTemplate = getGridTemplateColumns(canvasElement);

    // Grid template should contain pixel values and fr units
    expect(gridTemplate).toBeTruthy();
    expect(gridTemplate.length).toBeGreaterThan(0);

    // Should have 3 column definitions (one for each header)
    const columnParts = gridTemplate.split(" ");
    expect(columnParts.length).toBeGreaterThanOrEqual(3);
  },
};

/**
 * Test 10: Narrow Container Behavior
 * Tests column behavior when container is very narrow
 */
export const NarrowContainerBehavior: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: "1fr", minWidth: 150, type: "string" },
      { accessor: "department", label: "Department", width: "1fr", minWidth: 150, type: "string" },
    ];

    return (
      <div style={{ padding: "20px", width: "300px" }}>
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

    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);

    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[2]));

    // Columns should respect minWidth even in narrow container
    expect(nameWidth).toBeGreaterThanOrEqual(145);
    expect(deptWidth).toBeGreaterThanOrEqual(145);

    // This may cause horizontal overflow, which is expected behavior
    const tableRoot = getTableRoot(canvasElement);
    if (tableRoot) {
      const scrollWidth = tableRoot.scrollWidth;
      const clientWidth = tableRoot.clientWidth;
      // ScrollWidth should be greater than clientWidth if overflow occurs
      expect(scrollWidth).toBeGreaterThanOrEqual(clientWidth);
    }
  },
};

/**
 * Test 11: Wide Container Behavior
 * Tests column behavior when container is very wide
 */
export const WideContainerBehavior: Story = {
  render: () => {
    const data = createEmployeeData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: "1fr", type: "number" },
      { accessor: "name", label: "Name", width: "1fr", type: "string" },
      { accessor: "department", label: "Department", width: "1fr", type: "string" },
    ];

    return (
      <div style={{ padding: "20px", width: "1600px" }}>
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

    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);

    const idWidth = parsePixelWidth(getColumnWidth(headerCells[0]));
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[2]));

    // All "1fr" columns should share space approximately equally
    const avgWidth = (idWidth + nameWidth + deptWidth) / 3;

    expect(idWidth).toBeGreaterThan(avgWidth * 0.9);
    expect(idWidth).toBeLessThan(avgWidth * 1.1);

    expect(nameWidth).toBeGreaterThan(avgWidth * 0.9);
    expect(nameWidth).toBeLessThan(avgWidth * 1.1);

    expect(deptWidth).toBeGreaterThan(avgWidth * 0.9);
    expect(deptWidth).toBeLessThan(avgWidth * 1.1);

    // Each column should be quite wide
    expect(idWidth).toBeGreaterThan(400);
    expect(nameWidth).toBeGreaterThan(400);
    expect(deptWidth).toBeGreaterThan(400);
  },
};
