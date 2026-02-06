import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect } from "@storybook/test";
import { Row, SimpleTable } from "../..";
import { HeaderObject } from "../..";

// ============================================================================
// DATA INTERFACES
// ============================================================================

const createProductData = (): Row[] => {
  return [
    { id: 1, name: "Laptop", price: 1299.99, quantity: 15, status: "In Stock" },
    { id: 2, name: "Mouse", price: 29.99, quantity: 150, status: "In Stock" },
    { id: 3, name: "Keyboard", price: 89.99, quantity: 75, status: "Low Stock" },
    { id: 4, name: "Monitor", price: 399.99, quantity: 0, status: "Out of Stock" },
    { id: 5, name: "Webcam", price: 79.99, quantity: 45, status: "In Stock" },
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

const getHeaderCells = (canvasElement: HTMLElement): HTMLElement[] => {
  return Array.from(canvasElement.querySelectorAll(".st-header-cell"));
};

const getBodyRows = (canvasElement: HTMLElement): HTMLElement[] => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return [];
  return Array.from(bodyContainer.querySelectorAll(".st-row"));
};

const getCellsInRow = (row: HTMLElement): HTMLElement[] => {
  return Array.from(row.querySelectorAll(".st-cell"));
};

const getHeaderLabelText = (headerCell: HTMLElement): HTMLElement | null => {
  return headerCell.querySelector(".st-header-label-text");
};

const getCellContent = (cell: HTMLElement): HTMLElement | null => {
  return cell.querySelector(".st-cell-content");
};

const hasAlignmentClass = (
  element: HTMLElement | null,
  alignment: "left" | "center" | "right"
): boolean => {
  if (!element) return false;
  const className = `${alignment}-aligned`;
  return element.classList.contains(className);
};

const getTextAlign = (element: HTMLElement | null): string => {
  if (!element) return "";
  return window.getComputedStyle(element).textAlign;
};

const getJustifyContent = (element: HTMLElement | null): string => {
  if (!element) return "";
  return window.getComputedStyle(element).justifyContent;
};

// ============================================================================
// STORYBOOK META
// ============================================================================

const meta: Meta<typeof SimpleTable> = {
  title: "Tests/09-ColumnAlignmentTests",
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
 * Test 1: Left Alignment
 * Tests that columns with align="left" have correct CSS classes and styles
 */
export const LeftAlignment: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "left", type: "number" },
      { accessor: "name", label: "Product Name", width: "1fr", align: "left", type: "string" },
      { accessor: "status", label: "Status", width: 150, align: "left", type: "string" },
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
    expect(headerCells.length).toBe(3);

    // Check header alignment classes
    for (let i = 0; i < headerCells.length; i++) {
      const headerLabelText = getHeaderLabelText(headerCells[i]);
      expect(hasAlignmentClass(headerLabelText, "left")).toBe(true);
      expect(getTextAlign(headerLabelText)).toBe("left");
    }

    // Check cell alignment classes
    const rows = getBodyRows(canvasElement);
    expect(rows.length).toBeGreaterThan(0);

    const firstRow = rows[0];
    const cells = getCellsInRow(firstRow);
    expect(cells.length).toBe(3);

    for (let i = 0; i < cells.length; i++) {
      const cellContent = getCellContent(cells[i]);
      expect(hasAlignmentClass(cellContent, "left")).toBe(true);
      expect(getTextAlign(cellContent)).toBe("left");
      expect(getJustifyContent(cellContent)).toMatch(/flex-start|start/);
    }
  },
};

/**
 * Test 2: Center Alignment
 * Tests that columns with align="center" have correct CSS classes and styles
 */
export const CenterAlignment: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "center", type: "number" },
      { accessor: "name", label: "Product Name", width: "1fr", align: "center", type: "string" },
      { accessor: "status", label: "Status", width: 150, align: "center", type: "string" },
    ];

    return (
      <div style={{ padding: "20px" }}>
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

    // Check header alignment classes
    for (let i = 0; i < headerCells.length; i++) {
      const headerLabelText = getHeaderLabelText(headerCells[i]);
      expect(hasAlignmentClass(headerLabelText, "center")).toBe(true);
      expect(getTextAlign(headerLabelText)).toBe("center");
    }

    // Check cell alignment classes
    const rows = getBodyRows(canvasElement);
    expect(rows.length).toBeGreaterThan(0);

    const firstRow = rows[0];
    const cells = getCellsInRow(firstRow);
    expect(cells.length).toBe(3);

    for (let i = 0; i < cells.length; i++) {
      const cellContent = getCellContent(cells[i]);
      expect(hasAlignmentClass(cellContent, "center")).toBe(true);
      expect(getTextAlign(cellContent)).toBe("center");
      expect(getJustifyContent(cellContent)).toBe("center");
    }
  },
};

/**
 * Test 3: Right Alignment
 * Tests that columns with align="right" have correct CSS classes and styles
 */
export const RightAlignment: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "right", type: "number" },
      { accessor: "price", label: "Price", width: 120, align: "right", type: "number" },
      { accessor: "quantity", label: "Quantity", width: 120, align: "right", type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
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

    // Check header alignment classes
    for (let i = 0; i < headerCells.length; i++) {
      const headerLabelText = getHeaderLabelText(headerCells[i]);
      expect(hasAlignmentClass(headerLabelText, "right")).toBe(true);
      expect(getTextAlign(headerLabelText)).toBe("right");
    }

    // Check cell alignment classes
    const rows = getBodyRows(canvasElement);
    expect(rows.length).toBeGreaterThan(0);

    const firstRow = rows[0];
    const cells = getCellsInRow(firstRow);
    expect(cells.length).toBe(3);

    for (let i = 0; i < cells.length; i++) {
      const cellContent = getCellContent(cells[i]);
      expect(hasAlignmentClass(cellContent, "right")).toBe(true);
      expect(getTextAlign(cellContent)).toBe("right");
      expect(getJustifyContent(cellContent)).toMatch(/flex-end|end/);
    }
  },
};

/**
 * Test 4: Mixed Alignment
 * Tests a table with different alignment for different columns
 */
export const MixedAlignment: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "left", type: "number" },
      { accessor: "name", label: "Product Name", width: "1fr", align: "left", type: "string" },
      { accessor: "status", label: "Status", width: 150, align: "center", type: "string" },
      { accessor: "quantity", label: "Quantity", width: 120, align: "right", type: "number" },
      { accessor: "price", label: "Price", width: 120, align: "right", type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
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
    expect(headerCells.length).toBe(5);

    // Define expected alignments for each column
    const expectedAlignments: Array<"left" | "center" | "right"> = [
      "left",
      "left",
      "center",
      "right",
      "right",
    ];

    // Check header alignment
    for (let i = 0; i < headerCells.length; i++) {
      const headerLabelText = getHeaderLabelText(headerCells[i]);
      const expectedAlign = expectedAlignments[i];
      expect(hasAlignmentClass(headerLabelText, expectedAlign)).toBe(true);
    }

    // Check cell alignment
    const rows = getBodyRows(canvasElement);
    expect(rows.length).toBeGreaterThan(0);

    const firstRow = rows[0];
    const cells = getCellsInRow(firstRow);
    expect(cells.length).toBe(5);

    for (let i = 0; i < cells.length; i++) {
      const cellContent = getCellContent(cells[i]);
      const expectedAlign = expectedAlignments[i];
      expect(hasAlignmentClass(cellContent, expectedAlign)).toBe(true);
    }
  },
};

/**
 * Test 5: Default Alignment (No align property)
 * Tests that columns without align property default to left alignment
 */
export const DefaultAlignment: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Product Name", width: "1fr", type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
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

    // Check that all columns default to left alignment
    for (let i = 0; i < headerCells.length; i++) {
      const headerLabelText = getHeaderLabelText(headerCells[i]);
      expect(hasAlignmentClass(headerLabelText, "left")).toBe(true);
    }

    // Check cell alignment
    const rows = getBodyRows(canvasElement);
    expect(rows.length).toBeGreaterThan(0);

    const firstRow = rows[0];
    const cells = getCellsInRow(firstRow);
    expect(cells.length).toBe(3);

    for (let i = 0; i < cells.length; i++) {
      const cellContent = getCellContent(cells[i]);
      expect(hasAlignmentClass(cellContent, "left")).toBe(true);
    }
  },
};

/**
 * Test 6: Alignment with Sorting
 * Tests that alignment is maintained when sorting is enabled
 */
export const AlignmentWithSorting: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "left", isSortable: true, type: "number" },
      {
        accessor: "name",
        label: "Product Name",
        width: "1fr",
        align: "left",
        isSortable: true,
        type: "string",
      },
      {
        accessor: "price",
        label: "Price",
        width: 120,
        align: "right",
        isSortable: true,
        type: "number",
      },
    ];

    return (
      <div style={{ padding: "20px" }}>
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

    // Check that alignment is correct even with sorting enabled
    const idHeaderLabel = getHeaderLabelText(headerCells[0]);
    expect(hasAlignmentClass(idHeaderLabel, "left")).toBe(true);

    const nameHeaderLabel = getHeaderLabelText(headerCells[1]);
    expect(hasAlignmentClass(nameHeaderLabel, "left")).toBe(true);

    const priceHeaderLabel = getHeaderLabelText(headerCells[2]);
    expect(hasAlignmentClass(priceHeaderLabel, "right")).toBe(true);

    // Verify headers are clickable (indicating sorting is enabled)
    expect(headerCells[0].classList.contains("clickable")).toBe(true);
    expect(headerCells[1].classList.contains("clickable")).toBe(true);
    expect(headerCells[2].classList.contains("clickable")).toBe(true);
  },
};

/**
 * Test 7: Alignment with Filtering
 * Tests that alignment is maintained when filtering is enabled
 */
export const AlignmentWithFiltering: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "left", filterable: true, type: "number" },
      {
        accessor: "name",
        label: "Product Name",
        width: "1fr",
        align: "center",
        filterable: true,
        type: "string",
      },
      {
        accessor: "price",
        label: "Price",
        width: 120,
        align: "right",
        filterable: true,
        type: "number",
      },
    ];

    return (
      <div style={{ padding: "20px" }}>
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

    // Check that alignment is correct even with filtering enabled
    const idHeaderLabel = getHeaderLabelText(headerCells[0]);
    expect(hasAlignmentClass(idHeaderLabel, "left")).toBe(true);

    const nameHeaderLabel = getHeaderLabelText(headerCells[1]);
    expect(hasAlignmentClass(nameHeaderLabel, "center")).toBe(true);

    const priceHeaderLabel = getHeaderLabelText(headerCells[2]);
    expect(hasAlignmentClass(priceHeaderLabel, "right")).toBe(true);

    // Verify that filterable columns are present by checking the headers exist
    // (Filter UI appears on interaction, not by default)
    expect(headerCells.length).toBe(3);
  },
};

/**
 * Test 8: Alignment Consistency Across Rows
 * Tests that alignment is consistent across all rows in the table
 */
export const AlignmentConsistencyAcrossRows: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "center", type: "number" },
      { accessor: "name", label: "Product Name", width: "1fr", align: "left", type: "string" },
      { accessor: "price", label: "Price", width: 120, align: "right", type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
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

    const rows = getBodyRows(canvasElement);
    expect(rows.length).toBe(5); // We have 5 products

    const expectedAlignments: Array<"left" | "center" | "right"> = ["center", "left", "right"];

    // Check alignment for each row
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const cells = getCellsInRow(rows[rowIndex]);
      expect(cells.length).toBe(3);

      for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
        const cellContent = getCellContent(cells[cellIndex]);
        const expectedAlign = expectedAlignments[cellIndex];
        expect(hasAlignmentClass(cellContent, expectedAlign)).toBe(true);
      }
    }
  },
};

/**
 * Test 9: Alignment with Number Types
 * Tests that numeric columns can have different alignments
 */
export const AlignmentWithNumberTypes: Story = {
  render: () => {
    const data = createProductData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, align: "left", type: "number" },
      { accessor: "quantity", label: "Qty (Center)", width: 120, align: "center", type: "number" },
      { accessor: "price", label: "Price (Right)", width: 120, align: "right", type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
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

    // Verify each number column has its specified alignment
    const idHeaderLabel = getHeaderLabelText(headerCells[0]);
    expect(hasAlignmentClass(idHeaderLabel, "left")).toBe(true);

    const qtyHeaderLabel = getHeaderLabelText(headerCells[1]);
    expect(hasAlignmentClass(qtyHeaderLabel, "center")).toBe(true);

    const priceHeaderLabel = getHeaderLabelText(headerCells[2]);
    expect(hasAlignmentClass(priceHeaderLabel, "right")).toBe(true);

    // Check cells
    const rows = getBodyRows(canvasElement);
    const firstRow = rows[0];
    const cells = getCellsInRow(firstRow);

    const idCell = getCellContent(cells[0]);
    expect(hasAlignmentClass(idCell, "left")).toBe(true);

    const qtyCell = getCellContent(cells[1]);
    expect(hasAlignmentClass(qtyCell, "center")).toBe(true);

    const priceCell = getCellContent(cells[2]);
    expect(hasAlignmentClass(priceCell, "right")).toBe(true);
  },
};
