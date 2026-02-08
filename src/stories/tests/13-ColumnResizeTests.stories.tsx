import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect } from "@storybook/test";
import { Row, SimpleTable } from "../..";
import { HeaderObject } from "../..";

// ============================================================================
// DATA INTERFACES
// ============================================================================

const createStoreData = (): Row[] => {
  return [
    {
      id: 1,
      storeName: "Downtown Store",
      city: "New York",
      squareFootage: 5000,
      openingDate: "2020-01-15",
      customerRating: 4.5,
    },
    {
      id: 2,
      storeName: "Westside Mall",
      city: "Los Angeles",
      squareFootage: 7500,
      openingDate: "2019-06-20",
      customerRating: 4.2,
    },
    {
      id: 3,
      storeName: "Central Plaza",
      city: "Chicago",
      squareFootage: 6200,
      openingDate: "2021-03-10",
      customerRating: 4.7,
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

const getHeaderCells = (canvasElement: HTMLElement): HTMLElement[] => {
  return Array.from(canvasElement.querySelectorAll(".st-header-cell"));
};

const findHeaderCellByLabel = (
  canvasElement: HTMLElement,
  label: string
): HTMLElement | null => {
  const headers = getHeaderCells(canvasElement);
  for (const header of headers) {
    const labelElement = header.querySelector(".st-header-label");
    if (labelElement?.textContent?.trim() === label) {
      return header;
    }
  }
  return null;
};

const resizeColumn = async (
  headerCell: HTMLElement,
  resizeAmount: number
): Promise<{ initialWidth: number; finalWidth: number }> => {
  const initialWidth = headerCell.getBoundingClientRect().width;

  const resizeHandle = headerCell.querySelector(
    ".st-header-resize-handle-container"
  ) as HTMLElement;

  if (!resizeHandle) {
    throw new Error("Resize handle not found");
  }

  const startX = resizeHandle.getBoundingClientRect().left + 5;
  const endX = startX + resizeAmount;

  const mouseDownEvent = new MouseEvent("mousedown", {
    clientX: startX,
    clientY: resizeHandle.getBoundingClientRect().top + 5,
    bubbles: true,
    cancelable: true,
  });

  const mouseMoveEvent = new MouseEvent("mousemove", {
    clientX: endX,
    clientY: resizeHandle.getBoundingClientRect().top + 5,
    bubbles: true,
    cancelable: true,
  });

  const mouseUpEvent = new MouseEvent("mouseup", {
    clientX: endX,
    clientY: resizeHandle.getBoundingClientRect().top + 5,
    bubbles: true,
    cancelable: true,
  });

  resizeHandle.dispatchEvent(mouseDownEvent);
  document.dispatchEvent(mouseMoveEvent);
  document.dispatchEvent(mouseUpEvent);

  await new Promise((resolve) => setTimeout(resolve, 100));

  const finalWidth = headerCell.getBoundingClientRect().width;

  return { initialWidth, finalWidth };
};

// ============================================================================
// STORYBOOK META
// ============================================================================

const meta: Meta<typeof SimpleTable> = {
  title: "Tests/13 - Column Resize",
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
 * Test 1: Basic Column Resize
 * Tests that columns can be resized by dragging resize handles
 */
export const BasicColumnResize: Story = {
  render: () => {
    const data = createStoreData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          columnResizing={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Test resizing the "Store Name" column
    const storeNameHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeNameHeader).toBeTruthy();

    const resizeAmount = 50;
    const { initialWidth, finalWidth } = await resizeColumn(storeNameHeader!, resizeAmount);

    // Verify the column width increased by approximately the resize amount
    const widthChange = finalWidth - initialWidth;
    expect(Math.abs(widthChange - resizeAmount)).toBeLessThan(5);
  },
};

/**
 * Test 2: Resize Multiple Columns
 * Tests that multiple columns can be resized independently
 */
export const ResizeMultipleColumns: Story = {
  render: () => {
    const data = createStoreData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          columnResizing={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Resize first column
    const idHeader = findHeaderCellByLabel(canvasElement, "ID");
    expect(idHeader).toBeTruthy();
    const { initialWidth: idInitial, finalWidth: idFinal } = await resizeColumn(idHeader!, 20);
    expect(idFinal - idInitial).toBeGreaterThan(15);

    // Resize second column
    const storeNameHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeNameHeader).toBeTruthy();
    const { initialWidth: storeInitial, finalWidth: storeFinal } = await resizeColumn(
      storeNameHeader!,
      30
    );
    expect(storeFinal - storeInitial).toBeGreaterThan(25);

    // Resize third column
    const cityHeader = findHeaderCellByLabel(canvasElement, "City");
    expect(cityHeader).toBeTruthy();
    const { initialWidth: cityInitial, finalWidth: cityFinal } = await resizeColumn(
      cityHeader!,
      40
    );
    expect(cityFinal - cityInitial).toBeGreaterThan(35);
  },
};

/**
 * Test 3: Resize to Smaller Width
 * Tests that columns can be resized to smaller widths (negative resize amount)
 */
export const ResizeToSmallerWidth: Story = {
  render: () => {
    const data = createStoreData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 150, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 300, type: "string" },
      { accessor: "city", label: "City", width: 200, type: "string" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          columnResizing={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Resize "Store Name" column to smaller width
    const storeNameHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeNameHeader).toBeTruthy();

    const resizeAmount = -50; // Negative to make smaller
    const { initialWidth, finalWidth } = await resizeColumn(storeNameHeader!, resizeAmount);

    // Verify the column width decreased
    expect(finalWidth).toBeLessThan(initialWidth);
    const widthChange = finalWidth - initialWidth;
    expect(Math.abs(widthChange - resizeAmount)).toBeLessThan(5);
  },
};

/**
 * Test 4: Resize with MinWidth Constraint
 * Tests that columns respect minWidth when being resized smaller
 */
export const ResizeWithMinWidth: Story = {
  render: () => {
    const data = createStoreData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 150, minWidth: 100, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 300, minWidth: 200, type: "string" },
      { accessor: "city", label: "City", width: 200, minWidth: 150, type: "string" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          columnResizing={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Try to resize "Store Name" column below its minWidth
    const storeNameHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeNameHeader).toBeTruthy();

    // Try to resize by -150px (would go below minWidth of 200)
    const { finalWidth } = await resizeColumn(storeNameHeader!, -150);

    // Column should not go below minWidth (200px)
    // Allow small tolerance for borders/padding
    expect(finalWidth).toBeGreaterThanOrEqual(195);
  },
};

/**
 * Test 5: Resize All Columns
 * Tests that every column in the table can be resized
 */
export const ResizeAllColumns: Story = {
  render: () => {
    const data = createStoreData();
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
      { accessor: "openingDate", label: "Opening Date", width: 150, type: "string" },
      { accessor: "customerRating", label: "Customer Rating", width: 150, type: "number" },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          getRowId={(params) => String(params.row.id)}
          height="400px"
          columnResizing={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const columnLabels = [
      "ID",
      "Store Name",
      "City",
      "Square Footage",
      "Opening Date",
      "Customer Rating",
    ];

    // Resize each column and verify it works
    for (const label of columnLabels) {
      const header = findHeaderCellByLabel(canvasElement, label);
      expect(header).toBeTruthy();

      const { initialWidth, finalWidth } = await resizeColumn(header!, 20);
      const widthChange = finalWidth - initialWidth;

      // Allow small tolerance for rounding
      expect(Math.abs(widthChange - 20)).toBeLessThan(5);
    }
  },
};
