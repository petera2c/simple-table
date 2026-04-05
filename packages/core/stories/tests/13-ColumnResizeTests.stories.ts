/**
 * COLUMN RESIZE TESTS
 * Ported from React - same tests, vanilla table only.
 */

import { HeaderObject, SimpleTableVanilla } from "../../src/index";
import { expect } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/13 - Column Resize",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Comprehensive tests for column resizing including drag resize and min/max width.",
      },
    },
  },
};

export default meta;

const createStoreData = () => [
  { id: 1, storeName: "Downtown Store", city: "New York", squareFootage: 5000, openingDate: "2020-01-15", customerRating: 4.5 },
  { id: 2, storeName: "Westside Mall", city: "Los Angeles", squareFootage: 7500, openingDate: "2019-06-20", customerRating: 4.2 },
  { id: 3, storeName: "Central Plaza", city: "Chicago", squareFootage: 6200, openingDate: "2021-03-10", customerRating: 4.7 },
];

const getHeaderCells = (canvasElement: HTMLElement) => Array.from(canvasElement.querySelectorAll(".st-header-cell"));

const findHeaderCellByLabel = (canvasElement: HTMLElement, label: string): Element | null => {
  const headers = getHeaderCells(canvasElement);
  for (const header of headers) {
    const labelElement = header.querySelector(".st-header-label-text");
    if (labelElement?.textContent?.trim() === label) return header;
  }
  return null;
};

/**
 * Resize a column by simulating drag on its header resize handle.
 * @param headerCell - The header cell element
 * @param resizeAmount - Pixels to drag (positive = wider, negative = narrower)
 * @param getElementForFinalWidth - Optional: return the header element to measure after resize (use to avoid stale reference if DOM is updated)
 */
const resizeColumn = async (
  headerCell: Element,
  resizeAmount: number,
  getElementForFinalWidth?: () => Element | null,
) => {
  const doc = headerCell.ownerDocument;
  const initialWidth = headerCell.getBoundingClientRect().width;
  const resizeHandle = headerCell.querySelector(".st-header-resize-handle-container");
  if (!resizeHandle) throw new Error("Resize handle not found");
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
  doc.dispatchEvent(mouseMoveEvent);
  doc.dispatchEvent(mouseUpEvent);
  await new Promise((r) => setTimeout(r, 100));
  const elementForFinal = getElementForFinalWidth ? getElementForFinalWidth() : headerCell;
  const finalWidth = elementForFinal ? elementForFinal.getBoundingClientRect().width : 0;
  return { initialWidth, finalWidth };
};

export const BasicColumnResize = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (params) => String(params.row.id), height: "400px", columnResizing: true });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const storeNameHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeNameHeader).toBeTruthy();
    const resizeAmount = 50;
    const { initialWidth, finalWidth } = await resizeColumn(
      storeNameHeader!,
      resizeAmount,
      () => findHeaderCellByLabel(canvasElement, "Store Name"),
    );
    const widthChange = finalWidth - initialWidth;
    expect(Math.abs(widthChange - resizeAmount)).toBeLessThan(5);
  },
};

export const ResizeMultipleColumns = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (params) => String(params.row.id), height: "400px", columnResizing: true });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const idHeader = findHeaderCellByLabel(canvasElement, "ID");
    expect(idHeader).toBeTruthy();
    const { initialWidth: idInitial, finalWidth: idFinal } = await resizeColumn(
      idHeader!,
      20,
      () => findHeaderCellByLabel(canvasElement, "ID"),
    );
    expect(idFinal - idInitial).toBeGreaterThan(15);
    const storeNameHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeNameHeader).toBeTruthy();
    const { initialWidth: storeInitial, finalWidth: storeFinal } = await resizeColumn(
      storeNameHeader!,
      30,
      () => findHeaderCellByLabel(canvasElement, "Store Name"),
    );
    expect(storeFinal - storeInitial).toBeGreaterThan(25);
    const cityHeader = findHeaderCellByLabel(canvasElement, "City");
    expect(cityHeader).toBeTruthy();
    const { initialWidth: cityInitial, finalWidth: cityFinal } = await resizeColumn(
      cityHeader!,
      40,
      () => findHeaderCellByLabel(canvasElement, "City"),
    );
    expect(cityFinal - cityInitial).toBeGreaterThan(35);
  },
};

export const ResizeToSmallerWidth = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 150, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 300, type: "string" },
      { accessor: "city", label: "City", width: 200, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (params) => String(params.row.id), height: "400px", columnResizing: true });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const storeNameHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeNameHeader).toBeTruthy();
    const resizeAmount = -50;
    const { initialWidth, finalWidth } = await resizeColumn(
      storeNameHeader!,
      resizeAmount,
      () => findHeaderCellByLabel(canvasElement, "Store Name"),
    );
    expect(finalWidth).toBeLessThan(initialWidth);
    const widthChange = finalWidth - initialWidth;
    expect(Math.abs(widthChange - resizeAmount)).toBeLessThan(5);
  },
};

export const ResizeWithMinWidth = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 150, minWidth: 100, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 300, minWidth: 200, type: "string" },
      { accessor: "city", label: "City", width: 200, minWidth: 150, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (params) => String(params.row.id), height: "400px", columnResizing: true });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const storeNameHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeNameHeader).toBeTruthy();
    const { finalWidth } = await resizeColumn(
      storeNameHeader!,
      -150,
      () => findHeaderCellByLabel(canvasElement, "Store Name"),
    );
    expect(finalWidth).toBeGreaterThanOrEqual(195);
  },
};

export const ResizeAllColumns = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Square Footage", width: 150, type: "number" },
      { accessor: "openingDate", label: "Opening Date", width: 150, type: "string" },
      { accessor: "customerRating", label: "Customer Rating", width: 150, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), { getRowId: (params) => String(params.row.id), height: "400px", columnResizing: true });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const columnLabels = ["ID", "Store Name", "City", "Square Footage", "Opening Date", "Customer Rating"];
    for (const label of columnLabels) {
      const header = findHeaderCellByLabel(canvasElement, label);
      expect(header).toBeTruthy();
      const { initialWidth, finalWidth } = await resizeColumn(
        header!,
        20,
        () => findHeaderCellByLabel(canvasElement, label),
      );
      const widthChange = finalWidth - initialWidth;
      expect(Math.abs(widthChange - 20)).toBeLessThan(5);
    }
  },
};

// ============================================================================
// ON COLUMN WIDTH CHANGE CALLBACK
// ============================================================================

export const OnColumnWidthChangeCallbackFires = {
  render: () => {
    const captured: HeaderObject[][] = [];
    (window as unknown as { __widthChangeCapture?: HeaderObject[][] }).__widthChangeCapture = captured;

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 250, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
    ];
    const tableContainer = document.createElement("div");
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createStoreData(),
      getRowId: (params) => String(params.row.id),
      height: "400px",
      columnResizing: true,
      onColumnWidthChange: (newHeaders: HeaderObject[]) => {
        captured.push(newHeaders);
      },
    });
    table.mount();
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    wrapper.appendChild(tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const captured = (window as unknown as { __widthChangeCapture?: HeaderObject[][] }).__widthChangeCapture;
    expect(captured).toBeTruthy();

    const storeNameHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeNameHeader).toBeTruthy();
    await resizeColumn(storeNameHeader!, 30, () => findHeaderCellByLabel(canvasElement, "Store Name"));
    await new Promise((r) => setTimeout(r, 300));

    expect(captured!.length).toBeGreaterThan(0);
    expect(Array.isArray(captured![0])).toBe(true);
  },
};

// ============================================================================
// DOUBLE-CLICK AUTO-FIT
// ============================================================================

export const DoubleClickResizeHandleAutoFit = {
  parameters: { tags: ["column-resize-double-click-autofit"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 300, type: "number" },
      { accessor: "storeName", label: "Store Name", width: 100, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData().slice(0, 3), {
      getRowId: (params) => String(params.row.id),
      height: "300px",
      columnResizing: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const idHeader = findHeaderCellByLabel(canvasElement, "ID");
    expect(idHeader).toBeTruthy();

    const resizeHandle = idHeader!.querySelector<HTMLElement>(".st-header-resize-handle-container");
    expect(resizeHandle).toBeTruthy();

    const initialWidth = idHeader!.getBoundingClientRect().width;

    resizeHandle!.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 400));

    const idAfter = findHeaderCellByLabel(canvasElement, "ID");
    expect(idAfter).toBeTruthy();
    const finalWidth = idAfter!.getBoundingClientRect().width;

    // ID was 300px; numeric ids and header fit in far less — auto-fit must shrink the column.
    expect(finalWidth).toBeLessThan(initialWidth - 15);

    const storeHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeHeader).toBeTruthy();
    const storeResize = storeHeader!.querySelector<HTMLElement>(
      ".st-header-resize-handle-container",
    );
    expect(storeResize).toBeTruthy();
    const storeInitial = storeHeader!.getBoundingClientRect().width;
    storeResize!.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 400));
    const storeAfter = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeAfter).toBeTruthy();
    const storeFinal = storeAfter!.getBoundingClientRect().width;
    // Store Name started at 100px; row values are long store names — expect meaningful growth.
    expect(storeFinal).toBeGreaterThan(storeInitial + 10);
  },
};

// ============================================================================
// PINNED COLUMN RESIZE (NO AUTO-EXPAND)
// ============================================================================

const getColumnWidth = (headerCell: Element): string =>
  window.getComputedStyle(headerCell).width;

const parsePixelWidth = (widthString: string): number =>
  parseFloat(String(widthString).replace("px", ""));

const getHeaderSections = (canvasElement: HTMLElement) => ({
  left: canvasElement.querySelector(".st-header-pinned-left"),
  main: canvasElement.querySelector(".st-header-main"),
  right: canvasElement.querySelector(".st-header-pinned-right"),
});

const getHeaderCellsInSection = (section: Element | null): Element[] => {
  if (!section) return [];
  return Array.from(section.querySelectorAll(".st-header-cell"));
};

const createEmployeeData = () => [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", department: "Engineering", salary: 120000 },
  { id: 2, name: "Bob Smith", email: "bob@example.com", department: "Design", salary: 95000 },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", department: "Engineering", salary: 140000 },
];

export const ResizeLeftPinnedColumn = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, pinned: "left", type: "string" },
      { accessor: "email", label: "Email", width: 250, type: "string" },
      { accessor: "department", label: "Department", width: 180, type: "string" },
      { accessor: "salary", label: "Salary", width: 150, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), {
      getRowId: (params) => String(params.row.id),
      height: "400px",
      columnResizing: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const nameHeader = findHeaderCellByLabel(canvasElement, "Name");
    expect(nameHeader).toBeTruthy();

    const { initialWidth, finalWidth } = await resizeColumn(
      nameHeader!,
      40,
      () => findHeaderCellByLabel(canvasElement, "Name"),
    );
    expect(finalWidth).toBeGreaterThan(initialWidth);
    expect(Math.abs(finalWidth - initialWidth - 40)).toBeLessThan(5);

    const sections = getHeaderSections(canvasElement);
    expect(sections.left).toBeTruthy();
    const leftCells = getHeaderCellsInSection(sections.left);
    expect(leftCells.length).toBe(1);
  },
};

export const ResizeRightPinnedColumn = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "email", label: "Email", width: 250, type: "string" },
      { accessor: "salary", label: "Salary", width: 150, pinned: "right", type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), {
      getRowId: (params) => String(params.row.id),
      height: "400px",
      columnResizing: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const salaryHeader = findHeaderCellByLabel(canvasElement, "Salary");
    expect(salaryHeader).toBeTruthy();

    const initialWidth = salaryHeader!.getBoundingClientRect().width;
    await resizeColumn(salaryHeader!, 50, () =>
      findHeaderCellByLabel(canvasElement, "Salary"),
    );

    const salaryAfter = findHeaderCellByLabel(canvasElement, "Salary");
    expect(salaryAfter).toBeTruthy();
    const finalWidth = salaryAfter!.getBoundingClientRect().width;
    // Right-pinned resize reverses delta, so dragging right shrinks
    // The column should have changed width
    expect(finalWidth).not.toBe(initialWidth);

    const sections = getHeaderSections(canvasElement);
    expect(sections.right).toBeTruthy();
    const rightCells = getHeaderCellsInSection(sections.right);
    expect(rightCells.length).toBe(1);
    const w = parsePixelWidth(getColumnWidth(rightCells[0]));
    expect(w).toBeGreaterThan(0);
    expect(Number.isNaN(w)).toBe(false);
  },
};

export const ResizeWithBothPinnedSections = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 180, pinned: "left", type: "string" },
      { accessor: "email", label: "Email", width: 220, type: "string" },
      { accessor: "department", label: "Department", width: 160, type: "string" },
      { accessor: "salary", label: "Salary", width: 130, pinned: "right", type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), {
      getRowId: (params) => String(params.row.id),
      height: "400px",
      columnResizing: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Resize the left-pinned column
    const nameHeader = findHeaderCellByLabel(canvasElement, "Name");
    expect(nameHeader).toBeTruthy();
    const { initialWidth: nameInit, finalWidth: nameFinal } = await resizeColumn(
      nameHeader!,
      30,
      () => findHeaderCellByLabel(canvasElement, "Name"),
    );
    expect(nameFinal).toBeGreaterThan(nameInit);

    // Resize a main-section column
    const emailHeader = findHeaderCellByLabel(canvasElement, "Email");
    expect(emailHeader).toBeTruthy();
    const { initialWidth: emailInit, finalWidth: emailFinal } = await resizeColumn(
      emailHeader!,
      -25,
      () => findHeaderCellByLabel(canvasElement, "Email"),
    );
    expect(emailFinal).toBeLessThan(emailInit);

    // Verify all sections still have valid widths
    const sections = getHeaderSections(canvasElement);
    expect(sections.left).toBeTruthy();
    expect(sections.main).toBeTruthy();
    expect(sections.right).toBeTruthy();

    for (const section of [sections.left, sections.main, sections.right]) {
      getHeaderCellsInSection(section).forEach((c) => {
        const w = parsePixelWidth(getColumnWidth(c));
        expect(w).toBeGreaterThan(0);
        expect(Number.isNaN(w)).toBe(false);
      });
    }
  },
};
