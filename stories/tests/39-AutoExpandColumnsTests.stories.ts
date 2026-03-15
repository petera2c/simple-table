/**
 * AUTO EXPAND COLUMNS TESTS
 * Intensive tests for autoExpandColumns with pinned columns, row grouping,
 * column visibility, column resizing, horizontal scrolling, and edge cases.
 */

import type { Meta } from "@storybook/html";
import { expect, userEvent } from "@storybook/test";
import { HeaderObject, Row } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/39 - Auto Expand Columns",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Intensive tests for autoExpandColumns in combination with pinned columns, row grouping, column visibility, column resizing, horizontal scrolling, and edge cases.",
      },
    },
  },
};

export default meta;

// ============================================================================
// TEST DATA
// ============================================================================

const createEmployeeData = (): Row[] => [
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
    salary: 110000,
    projects: 4,
  },
  {
    id: 5,
    name: "Eve Adams",
    email: "eve@example.com",
    department: "Sales",
    salary: 105000,
    projects: 6,
  },
];

const createStoreData = () => [
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

const createGroupedData = () => [
  {
    id: "dept-1",
    name: "Engineering",
    budget: 500000,
    teams: [
      { id: "team-1", name: "Frontend Team", size: 5 },
      { id: "team-2", name: "Backend Team", size: 6 },
    ],
  },
  {
    id: "dept-2",
    name: "Sales",
    budget: 300000,
    teams: [{ id: "team-3", name: "Enterprise Sales", size: 4 }],
  },
  {
    id: "dept-3",
    name: "Marketing",
    budget: 250000,
    teams: [{ id: "team-4", name: "Digital Marketing", size: 3 }],
  },
];

// ============================================================================
// SHARED HELPERS (from 08, 10, 13, 15, 05)
// ============================================================================

const getHeaderCells = (canvasElement: HTMLElement): Element[] =>
  Array.from(canvasElement.querySelectorAll(".st-header-cell"));

const getColumnWidth = (headerCell: Element): string =>
  window.getComputedStyle(headerCell).width;

const parsePixelWidth = (widthString: string): number =>
  parseFloat(String(widthString).replace("px", ""));

const getTableRoot = (canvasElement: HTMLElement): Element | null =>
  canvasElement.querySelector(".st-table-root") ||
  canvasElement.querySelector(".simple-table-root") ||
  canvasElement.querySelector(".st-body-container");

const getHeaderSections = (canvasElement: HTMLElement) => ({
  left: canvasElement.querySelector(".st-header-pinned-left"),
  main: canvasElement.querySelector(".st-header-main"),
  right: canvasElement.querySelector(".st-header-pinned-right"),
});

const getBodySections = (canvasElement: HTMLElement) => ({
  left: canvasElement.querySelector(".st-body-pinned-left"),
  main: canvasElement.querySelector(".st-body-main"),
  right: canvasElement.querySelector(".st-body-pinned-right"),
});

const getHeaderCellsInSection = (section: Element | null): Element[] => {
  if (!section) return [];
  return Array.from(section.querySelectorAll(".st-header-cell"));
};

const getFlexShrink = (element: Element | null): string =>
  element ? window.getComputedStyle(element as HTMLElement).flexShrink : "";

const hasBorder = (
  element: Element | null,
  side: "left" | "right",
): boolean => {
  if (!element) return false;
  const style = window.getComputedStyle(element as HTMLElement);
  const borderProp =
    side === "left" ? style.borderLeftWidth : style.borderRightWidth;
  return parseFloat(borderProp) > 0;
};

const findHeaderCellByLabel = (
  canvasElement: HTMLElement,
  label: string,
): Element | null => {
  const headers = getHeaderCells(canvasElement);
  for (const header of headers) {
    const labelEl =
      header.querySelector(".st-header-label-text") ||
      header.querySelector(".st-header-label");
    if (labelEl?.textContent?.trim() === label) return header;
  }
  return null;
};

const resizeColumn = async (
  headerCell: Element,
  resizeAmount: number,
  getElementForFinalWidth?: () => Element | null,
): Promise<{ initialWidth: number; finalWidth: number }> => {
  const doc = headerCell.ownerDocument;
  const initialWidth = headerCell.getBoundingClientRect().width;
  const resizeHandle = headerCell.querySelector(
    ".st-header-resize-handle-container",
  );
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
  const elementForFinal = getElementForFinalWidth
    ? getElementForFinalWidth()
    : headerCell;
  const finalWidth = elementForFinal
    ? elementForFinal.getBoundingClientRect().width
    : 0;
  return { initialWidth, finalWidth };
};

const openColumnEditor = async (
  canvasElement: HTMLElement,
): Promise<Element> => {
  const columnEditorText = canvasElement.querySelector(
    ".st-column-editor-text",
  );
  expect(columnEditorText).toBeTruthy();
  (columnEditorText as HTMLElement).click();
  await new Promise((r) => setTimeout(r, 300));
  const popout =
    canvasElement.querySelector(".st-column-editor-popout.open") ??
    canvasElement.querySelector(".st-column-editor-popout");
  expect(popout).toBeTruthy();
  return popout!;
};

const getColumnCheckboxItems = (popout: Element): Element[] =>
  Array.from(popout.querySelectorAll(".st-header-checkbox-item"));

const getColumnLabelFromCheckbox = (checkboxItem: Element): string => {
  const labelSpan = checkboxItem.querySelector(".st-checkbox-label-text");
  if (labelSpan?.textContent?.trim()) return labelSpan.textContent.trim();
  return checkboxItem.textContent?.trim() || "";
};

const getCheckboxInput = (checkboxItem: Element): HTMLInputElement => {
  const checkbox = checkboxItem.querySelector(
    ".st-checkbox-input",
  ) as HTMLInputElement;
  expect(checkbox).toBeTruthy();
  return checkbox;
};

const toggleColumnVisibility = async (checkboxItem: Element): Promise<void> => {
  getCheckboxInput(checkboxItem).click();
  await new Promise((r) => setTimeout(r, 300));
};

const isColumnVisible = (
  canvasElement: HTMLElement,
  columnLabel: string,
): boolean => {
  const headers = canvasElement.querySelectorAll(".st-header-cell");
  for (const header of Array.from(headers)) {
    const label = header.querySelector(
      ".st-header-label, .st-header-label-text",
    );
    if (label?.textContent?.trim() === columnLabel) return true;
  }
  return false;
};

const findExpandIconInRow = (rowCells: Element[]): Element | null => {
  for (const cell of rowCells) {
    const icon = cell.querySelector(".st-expand-icon-container");
    if (icon && icon.getAttribute("aria-hidden") !== "true") return icon;
  }
  return null;
};

const clickExpandIcon = async (
  canvasElement: HTMLElement,
  rowIndex: number,
): Promise<void> => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) throw new Error("Body container not found");
  const rowCells = bodyContainer.querySelectorAll(
    `.st-cell[data-row-index="${rowIndex}"]`,
  );
  if (rowCells.length === 0)
    throw new Error(`No cells found for row index ${rowIndex}`);
  const expandIcon = findExpandIconInRow(Array.from(rowCells));
  if (!expandIcon) throw new Error(`Expand icon not found in row ${rowIndex}`);
  const user = userEvent.setup();
  await user.click(expandIcon);
  await new Promise((r) => setTimeout(r, 500));
};

function renderWithWidth(
  headers: HeaderObject[],
  data: Row[],
  options: Record<string, unknown> = {},
  wrapperWidth: string | null = null,
): HTMLElement {
  const { wrapper } = renderVanillaTable(headers, data, {
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    height: "400px",
    ...options,
  });
  if (wrapperWidth) wrapper.style.width = wrapperWidth;
  wrapper.style.boxSizing = "border-box";
  return wrapper;
}

const WIDTH_TOLERANCE = 20;
const MIN_COLUMN_WIDTH = 40;

// ============================================================================
// 1. AUTO EXPAND + PINNED COLUMNS
// ============================================================================

export const AutoExpandWithLeftPinned = {
  render: () => {
    const headers: HeaderObject[] = [
      {
        accessor: "name",
        label: "Name",
        width: 150,
        pinned: "left",
        type: "string",
      },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      {
        accessor: "department",
        label: "Department",
        width: 150,
        type: "string",
      },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    return renderWithWidth(
      headers,
      createEmployeeData(),
      {
        autoExpandColumns: true,
        height: "400px",
      },
      "100%",
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const sections = getHeaderSections(canvasElement);
    expect(sections.left).toBeTruthy();
    expect(sections.main).toBeTruthy();
    const leftCells = getHeaderCellsInSection(sections.left);
    const mainCells = getHeaderCellsInSection(sections.main);
    expect(leftCells.length).toBe(1);
    expect(mainCells.length).toBe(3);
    const bodyMain = getBodySections(canvasElement).main as HTMLElement;
    if (bodyMain) {
      expect(bodyMain.scrollWidth).toBeLessThanOrEqual(
        bodyMain.clientWidth + 2,
      );
    }
    const leftWidth = leftCells.reduce(
      (sum, c) => sum + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    const mainWidth = mainCells.reduce(
      (sum, c) => sum + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    const container = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    const total = leftWidth + mainWidth;
    expect(
      Math.abs(total - (container?.clientWidth ?? 700)),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);
  },
};

export const AutoExpandWithRightPinned = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      {
        accessor: "department",
        label: "Department",
        width: 150,
        type: "string",
      },
      {
        accessor: "projects",
        label: "Projects",
        width: 100,
        pinned: "right",
        type: "number",
      },
    ];
    return renderWithWidth(
      headers,
      createEmployeeData(),
      {
        autoExpandColumns: true,
        height: "400px",
      },
      "100%",
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const sections = getHeaderSections(canvasElement);
    expect(sections.right).toBeTruthy();
    expect(sections.main).toBeTruthy();
    const rightCells = getHeaderCellsInSection(sections.right);
    const mainCells = getHeaderCellsInSection(sections.main);
    expect(rightCells.length).toBe(1);
    expect(mainCells.length).toBe(3);
    const bodyMain = getBodySections(canvasElement).main as HTMLElement;
    if (bodyMain) {
      expect(bodyMain.scrollWidth).toBeLessThanOrEqual(
        bodyMain.clientWidth + 2,
      );
    }
    const rightWidth = rightCells.reduce(
      (sum, c) => sum + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    const mainWidth = mainCells.reduce(
      (sum, c) => sum + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    const container = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    const total = rightWidth + mainWidth;
    expect(
      Math.abs(total - (container?.clientWidth ?? 700)),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);
  },
};

export const AutoExpandWithBothLeftAndRightPinned = {
  render: () => {
    const headers: HeaderObject[] = [
      {
        accessor: "name",
        label: "Name",
        width: 150,
        pinned: "left",
        type: "string",
      },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      {
        accessor: "department",
        label: "Department",
        width: 150,
        type: "string",
      },
      {
        accessor: "projects",
        label: "Projects",
        width: 100,
        pinned: "right",
        type: "number",
      },
    ];
    return renderWithWidth(
      headers,
      createEmployeeData(),
      {
        autoExpandColumns: true,
        height: "400px",
      },
      "100%",
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const sections = getHeaderSections(canvasElement);
    expect(sections.left).toBeTruthy();
    expect(sections.main).toBeTruthy();
    expect(sections.right).toBeTruthy();
    const leftCells = getHeaderCellsInSection(sections.left);
    const mainCells = getHeaderCellsInSection(sections.main);
    const rightCells = getHeaderCellsInSection(sections.right);
    expect(leftCells.length).toBe(1);
    expect(mainCells.length).toBe(2);
    expect(rightCells.length).toBe(1);
    const leftW = leftCells.reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    const mainW = mainCells.reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    const rightW = rightCells.reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    const container = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    const total = leftW + mainW + rightW;
    expect(
      Math.abs(total - (container?.clientWidth ?? 700)),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);
  },
};

export const AutoExpandMultiplePinnedBothSides = {
  render: () => {
    const headers: HeaderObject[] = [
      {
        accessor: "id",
        label: "ID",
        width: 60,
        pinned: "left",
        type: "number",
      },
      {
        accessor: "name",
        label: "Name",
        width: 150,
        pinned: "left",
        type: "string",
      },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      {
        accessor: "department",
        label: "Department",
        width: 150,
        type: "string",
      },
      {
        accessor: "salary",
        label: "Salary",
        width: 120,
        pinned: "right",
        type: "number",
      },
      {
        accessor: "projects",
        label: "Projects",
        width: 100,
        pinned: "right",
        type: "number",
      },
    ];
    return renderWithWidth(
      headers,
      createEmployeeData(),
      {
        autoExpandColumns: true,
        height: "400px",
      },
      "800px",
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const sections = getHeaderSections(canvasElement);
    expect(sections.left).toBeTruthy();
    expect(sections.main).toBeTruthy();
    expect(sections.right).toBeTruthy();
    const leftCells = getHeaderCellsInSection(sections.left);
    const mainCells = getHeaderCellsInSection(sections.main);
    const rightCells = getHeaderCellsInSection(sections.right);
    expect(leftCells.length).toBe(2);
    expect(mainCells.length).toBe(2);
    expect(rightCells.length).toBe(2);
    expect(getFlexShrink(sections.left)).toBe("0");
    expect(getFlexShrink(sections.right)).toBe("0");
    expect(hasBorder(sections.left, "right")).toBe(true);
    expect(hasBorder(sections.right, "left")).toBe(true);
    const totalW =
      leftCells.reduce((s, c) => s + parsePixelWidth(getColumnWidth(c)), 0) +
      mainCells.reduce((s, c) => s + parsePixelWidth(getColumnWidth(c)), 0) +
      rightCells.reduce((s, c) => s + parsePixelWidth(getColumnWidth(c)), 0);
    const container = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    expect(
      Math.abs(totalW - (container?.clientWidth ?? 800)),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);
  },
};

export const PinnedSectionScalesWithinBounds = {
  render: () => {
    const headers: HeaderObject[] = [
      {
        accessor: "name",
        label: "Name",
        width: 200,
        pinned: "left",
        type: "string",
      },
      { accessor: "email", label: "Email", width: 300, type: "string" },
      {
        accessor: "department",
        label: "Department",
        width: 200,
        type: "string",
      },
    ];
    return renderWithWidth(
      headers,
      createEmployeeData(),
      {
        autoExpandColumns: true,
        height: "400px",
      },
      "100%",
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const container = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    const containerWidth = container?.clientWidth ?? 1000;
    const maxPinnedPercent = 0.6;
    const maxPinnedWidth = containerWidth * maxPinnedPercent;
    const sections = getHeaderSections(canvasElement);
    const leftCells = getHeaderCellsInSection(sections.left);
    const leftSectionWidth = leftCells.reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    expect(leftSectionWidth).toBeLessThanOrEqual(
      maxPinnedWidth + WIDTH_TOLERANCE,
    );
    const mainCells = getHeaderCellsInSection(sections.main);
    const mainWidth = mainCells.reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    expect(mainWidth).toBeGreaterThan(containerWidth * 0.35);
  },
};

// ============================================================================
// 2. AUTO EXPAND + ROW GROUPING
// ============================================================================

export const AutoExpandWithRowGrouping = {
  render: () => {
    const headers: HeaderObject[] = [
      {
        accessor: "name",
        label: "Name",
        width: 250,
        expandable: true,
        type: "string",
      },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Team Size", width: 120, type: "number" },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createGroupedData(), {
      getRowId: (p: { row?: { id?: string } }) =>
        String((p.row as { id?: string })?.id),
      height: "400px",
      autoExpandColumns: true,
      rowGrouping: ["teams"],
    });
    wrapper.style.width = "700px";
    h2.textContent = "Auto Expand with Row Grouping";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBeGreaterThanOrEqual(3);
    const bodyContainer = canvasElement.querySelector(".st-body-container");
    expect(bodyContainer).toBeTruthy();
    const cells = canvasElement.querySelectorAll(".st-cell");
    expect(cells.length).toBeGreaterThan(0);
    const bodyMain = getBodySections(canvasElement).main as HTMLElement;
    if (bodyMain && bodyMain.scrollWidth <= bodyMain.clientWidth + 50) {
      const totalHeaderW = headerCells.reduce(
        (s, c) => s + parsePixelWidth(getColumnWidth(c)),
        0,
      );
      const container = canvasElement.querySelector(
        ".st-body-container",
      ) as HTMLElement;
      expect(totalHeaderW).toBeGreaterThan(0);
      expect(container).toBeTruthy();
    }
  },
};

export const AutoExpandGroupedExpandCollapse = {
  render: () => {
    const headers: HeaderObject[] = [
      {
        accessor: "name",
        label: "Name",
        width: 250,
        expandable: true,
        type: "string",
      },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Size", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createGroupedData(), {
      getRowId: (p: { row?: { id?: string } }) =>
        String((p.row as { id?: string })?.id),
      height: "400px",
      autoExpandColumns: true,
      rowGrouping: ["teams"],
      expandAll: false,
    });
    wrapper.style.width = "100%";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const headerCellsBefore = getHeaderCells(canvasElement);
    expect(headerCellsBefore.length).toBeGreaterThanOrEqual(3);
    await clickExpandIcon(canvasElement, 0);
    const headerCellsAfterExpand = getHeaderCells(canvasElement);
    expect(headerCellsAfterExpand.length).toBeGreaterThanOrEqual(3);
    headerCellsAfterExpand.forEach((cell) => {
      const w = parsePixelWidth(getColumnWidth(cell));
      expect(w).toBeGreaterThan(0);
      expect(Number.isNaN(w)).toBe(false);
    });
    await clickExpandIcon(canvasElement, 0);
    const headerCellsAfterCollapse = getHeaderCells(canvasElement);
    expect(headerCellsAfterCollapse.length).toBeGreaterThanOrEqual(3);
  },
};

export const AutoExpandWithNestedGrouping = {
  render: () => {
    const nestedData = [
      {
        id: "dept-1",
        name: "Engineering",
        budget: 500000,
        teams: [
          {
            id: "team-1",
            name: "Frontend",
            size: 5,
            members: [
              { id: "e1", name: "Alice", role: "Engineer", salary: 120000 },
              { id: "e2", name: "Bob", role: "Engineer", salary: 95000 },
            ],
          },
        ],
      },
    ];
    const headers: HeaderObject[] = [
      {
        accessor: "name",
        label: "Name",
        width: 200,
        expandable: true,
        type: "string",
      },
      { accessor: "budget", label: "Budget", width: 120, type: "number" },
      { accessor: "size", label: "Size", width: 80, type: "number" },
      { accessor: "role", label: "Role", width: 120, type: "string" },
      { accessor: "salary", label: "Salary", width: 100, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, nestedData as Row[], {
      getRowId: (p: { row?: unknown }) =>
        String((p.row as { id?: string })?.id ?? ""),
      height: "400px",
      autoExpandColumns: true,
      rowGrouping: ["teams", "members"],
      expandAll: false,
    });
    wrapper.style.width = "800px";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBeGreaterThanOrEqual(3);
    await clickExpandIcon(canvasElement, 0);
    await new Promise((r) => setTimeout(r, 300));
    const cells = canvasElement.querySelectorAll(".st-header-cell");
    expect(cells.length).toBeGreaterThan(0);
    cells.forEach((c) => {
      const w = parsePixelWidth(getColumnWidth(c));
      expect(w).toBeGreaterThan(0);
      expect(Number.isNaN(w)).toBe(false);
    });
  },
};

// ============================================================================
// 3. AUTO EXPAND + COLUMN VISIBILITY (HIDING)
// ============================================================================

export const AutoExpandHideColumnReexpand = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "storeName",
        label: "Store Name",
        width: 200,
        type: "string",
      },
      { accessor: "city", label: "City", width: 150, type: "string" },
      {
        accessor: "squareFootage",
        label: "Square Footage",
        width: 150,
        type: "number",
      },
      {
        accessor: "customerRating",
        label: "Rating",
        width: 120,
        type: "number",
      },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      autoExpandColumns: true,
      editColumns: true,
    });
    wrapper.style.width = "900px";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const headerCellsBefore = getHeaderCells(canvasElement);
    const totalBefore = headerCellsBefore.reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    const container = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    expect(
      Math.abs(totalBefore - (container?.clientWidth ?? 900)),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);
    const popout = await openColumnEditor(canvasElement);
    const items = getColumnCheckboxItems(popout);
    const cityItem = items.find(
      (i) => getColumnLabelFromCheckbox(i) === "City",
    );
    expect(cityItem).toBeTruthy();
    await toggleColumnVisibility(cityItem!);
    await new Promise((r) => setTimeout(r, 500));
    expect(isColumnVisible(canvasElement, "City")).toBe(false);
    const headerCellsAfter = getHeaderCells(canvasElement);
    const totalAfter = headerCellsAfter.reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    expect(
      Math.abs(totalAfter - (container?.clientWidth ?? 900)),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);
  },
};

export const AutoExpandShowColumnReexpand = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "storeName",
        label: "Store Name",
        width: 200,
        type: "string",
      },
      {
        accessor: "city",
        label: "City",
        width: 150,
        type: "string",
        hide: true,
      },
      {
        accessor: "squareFootage",
        label: "Square Footage",
        width: 150,
        type: "number",
      },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      autoExpandColumns: true,
      editColumns: true,
    });
    wrapper.style.width = "100%";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(isColumnVisible(canvasElement, "City")).toBe(false);
    const popout = await openColumnEditor(canvasElement);
    const items = getColumnCheckboxItems(popout);
    const cityItem = items.find(
      (i) => getColumnLabelFromCheckbox(i) === "City",
    );
    expect(cityItem).toBeTruthy();
    await toggleColumnVisibility(cityItem!);
    await new Promise((r) => setTimeout(r, 500));
    expect(isColumnVisible(canvasElement, "City")).toBe(true);
    const headerCells = getHeaderCells(canvasElement);
    const totalW = headerCells.reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    const container = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    expect(
      Math.abs(totalW - (container?.clientWidth ?? 700)),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);
  },
};

export const AutoExpandHideMultipleThenShowOne = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "storeName",
        label: "Store Name",
        width: 200,
        type: "string",
      },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Sq Ft", width: 150, type: "number" },
      { accessor: "openingDate", label: "Opening", width: 150, type: "string" },
      {
        accessor: "customerRating",
        label: "Rating",
        width: 120,
        type: "number",
      },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      autoExpandColumns: true,
      editColumns: true,
    });
    wrapper.style.width = "800px";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    let popout = await openColumnEditor(canvasElement);
    for (const label of ["City", "Opening"]) {
      const items = getColumnCheckboxItems(popout);
      const item = items.find((i) => getColumnLabelFromCheckbox(i) === label);
      expect(item).toBeTruthy();
      await toggleColumnVisibility(item!);
      await new Promise((r) => setTimeout(r, 300));
      popout =
        canvasElement.querySelector(".st-column-editor-popout.open") ??
        canvasElement.querySelector(".st-column-editor-popout") ??
        popout;
    }
    expect(isColumnVisible(canvasElement, "City")).toBe(false);
    expect(isColumnVisible(canvasElement, "Opening")).toBe(false);
    const container = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    const headerCellsAfterHide = getHeaderCells(canvasElement);
    const totalAfterHide = headerCellsAfterHide.reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    expect(
      Math.abs(totalAfterHide - (container?.clientWidth ?? 800)),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);
    popout = await openColumnEditor(canvasElement);
    const cityItem = getColumnCheckboxItems(popout).find(
      (i) => getColumnLabelFromCheckbox(i) === "City",
    );
    expect(cityItem).toBeTruthy();
    await toggleColumnVisibility(cityItem!);
    await new Promise((r) => setTimeout(r, 500));
    expect(isColumnVisible(canvasElement, "City")).toBe(true);
    const headerCellsAfterShow = getHeaderCells(canvasElement);
    const totalAfterShow = headerCellsAfterShow.reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    expect(
      Math.abs(totalAfterShow - (container?.clientWidth ?? 800)),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);
  },
};

// ============================================================================
// 4. AUTO EXPAND + COLUMN RESIZING
// ============================================================================

export const AutoExpandResizeOneColumnProportional = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "storeName",
        label: "Store Name",
        width: 200,
        type: "string",
      },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Sq Ft", width: 150, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      autoExpandColumns: true,
      columnResizing: true,
    });
    wrapper.style.width = "800px";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const storeNameHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeNameHeader).toBeTruthy();
    const container = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    const containerWidth = container?.clientWidth ?? 800;
    const { initialWidth, finalWidth } = await resizeColumn(
      storeNameHeader!,
      50,
      () => findHeaderCellByLabel(canvasElement, "Store Name"),
    );
    expect(finalWidth).toBeGreaterThan(initialWidth);
    const headersAfter = getHeaderCells(canvasElement);
    const totalAfter = headersAfter.reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    expect(Math.abs(totalAfter - containerWidth)).toBeLessThanOrEqual(
      WIDTH_TOLERANCE,
    );
    expect(totalAfter).toBeLessThanOrEqual(containerWidth + 5);
  },
};

export const AutoExpandResizeThenReexpandOnEnd = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "storeName",
        label: "Store Name",
        width: 200,
        type: "string",
      },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Sq Ft", width: 150, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      autoExpandColumns: true,
      columnResizing: true,
    });
    wrapper.style.width = "100%";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const storeNameHeader = findHeaderCellByLabel(canvasElement, "Store Name");
    expect(storeNameHeader).toBeTruthy();
    await resizeColumn(storeNameHeader!, 30, () =>
      findHeaderCellByLabel(canvasElement, "Store Name"),
    );
    await new Promise((r) => setTimeout(r, 250));
    const headerCells = getHeaderCells(canvasElement);
    const totalW = headerCells.reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    const container = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    expect(
      Math.abs(totalW - (container?.clientWidth ?? 800)),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);
    headerCells.forEach((c) => {
      const w = parsePixelWidth(getColumnWidth(c));
      expect(w).toBeGreaterThanOrEqual(MIN_COLUMN_WIDTH - 2);
    });
  },
};

export const AutoExpandResizePinnedColumn = {
  render: () => {
    const headers: HeaderObject[] = [
      {
        accessor: "name",
        label: "Name",
        width: 150,
        pinned: "left",
        type: "string",
      },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      {
        accessor: "department",
        label: "Department",
        width: 150,
        type: "string",
      },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      autoExpandColumns: true,
      columnResizing: true,
    });
    wrapper.style.width = "100%";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const nameHeader = findHeaderCellByLabel(canvasElement, "Name");
    expect(nameHeader).toBeTruthy();
    const container = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    const containerWidth = container?.clientWidth ?? 700;
    const maxPinnedWidth = containerWidth * 0.6;
    await resizeColumn(nameHeader!, 40, () =>
      findHeaderCellByLabel(canvasElement, "Name"),
    );
    await new Promise((r) => setTimeout(r, 150));
    const sections = getHeaderSections(canvasElement);
    const leftCells = getHeaderCellsInSection(sections.left);
    const leftWidth = leftCells.reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    expect(leftWidth).toBeLessThanOrEqual(maxPinnedWidth + WIDTH_TOLERANCE);
    const mainCells = getHeaderCellsInSection(sections.main);
    expect(mainCells.length).toBe(3);
  },
};

export const AutoExpandResizeMultipleColumns = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "storeName",
        label: "Store Name",
        width: 200,
        type: "string",
      },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Sq Ft", width: 150, type: "number" },
      {
        accessor: "customerRating",
        label: "Rating",
        width: 100,
        type: "number",
      },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      autoExpandColumns: true,
      columnResizing: true,
    });
    wrapper.style.width = "100%";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const container = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    const containerWidth = container?.clientWidth ?? 900;
    const idHeader = findHeaderCellByLabel(canvasElement, "ID");
    expect(idHeader).toBeTruthy();
    await resizeColumn(idHeader!, 25, () =>
      findHeaderCellByLabel(canvasElement, "ID"),
    );
    let totalW = getHeaderCells(canvasElement).reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    expect(Math.abs(totalW - containerWidth)).toBeLessThanOrEqual(
      WIDTH_TOLERANCE,
    );
    const cityHeader = findHeaderCellByLabel(canvasElement, "City");
    expect(cityHeader).toBeTruthy();
    await resizeColumn(cityHeader!, -20, () =>
      findHeaderCellByLabel(canvasElement, "City"),
    );
    totalW = getHeaderCells(canvasElement).reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    expect(Math.abs(totalW - containerWidth)).toBeLessThanOrEqual(
      WIDTH_TOLERANCE,
    );
  },
};

// ============================================================================
// 5. AUTO EXPAND + SCROLLING
// ============================================================================

export const AutoExpandWideContainerNoHorizontalScroll = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: 100, type: "string" },
      { accessor: "email", label: "Email", width: 100, type: "string" },
      { accessor: "department", label: "Dept", width: 80, type: "string" },
      { accessor: "salary", label: "Salary", width: 80, type: "number" },
      { accessor: "projects", label: "Projects", width: 60, type: "number" },
    ];
    return renderWithWidth(
      headers,
      createEmployeeData(),
      {
        autoExpandColumns: true,
        height: "400px",
      },
      "100%",
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const bodyMain = canvasElement.querySelector(
      ".st-body-main",
    ) as HTMLElement;
    expect(bodyMain).toBeTruthy();
    expect(bodyMain.scrollWidth).toBeLessThanOrEqual(bodyMain.clientWidth + 2);
    expect(bodyMain.scrollLeft).toBe(0);
  },
};

export const AutoExpandNarrowContainerHorizontalScroll = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, minWidth: 60, type: "number" },
      {
        accessor: "name",
        label: "Name",
        width: 150,
        minWidth: 80,
        type: "string",
      },
      {
        accessor: "email",
        label: "Email",
        width: 200,
        minWidth: 80,
        type: "string",
      },
      {
        accessor: "department",
        label: "Dept",
        width: 150,
        minWidth: 80,
        type: "string",
      },
      {
        accessor: "salary",
        label: "Salary",
        width: 120,
        minWidth: 60,
        type: "number",
      },
    ];
    return renderWithWidth(
      headers,
      createEmployeeData(),
      {
        autoExpandColumns: true,
        height: "400px",
      },
      "100%",
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const bodyMain = canvasElement.querySelector(
      ".st-body-main",
    ) as HTMLElement;
    expect(bodyMain).toBeTruthy();
    expect(bodyMain.scrollWidth).toBeGreaterThan(bodyMain.clientWidth);
  },
};

export const AutoExpandHorizontalScrollHeaderBodySync = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 150, type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Dept", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    return renderWithWidth(
      headers,
      createEmployeeData(),
      {
        autoExpandColumns: true,
        height: "400px",
      },
      "100%",
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const bodyMain = canvasElement.querySelector(
      ".st-body-main",
    ) as HTMLElement;
    const headerMain = canvasElement.querySelector(
      ".st-header-main",
    ) as HTMLElement;
    expect(bodyMain).toBeTruthy();
    expect(headerMain).toBeTruthy();
    if (bodyMain.scrollWidth > bodyMain.clientWidth) {
      bodyMain.scrollLeft = 100;
      bodyMain.dispatchEvent(new Event("scroll", { bubbles: true }));
      await new Promise((r) => setTimeout(r, 50));
      expect(headerMain.scrollLeft).toBe(100);
    }
  },
};

export const AutoExpandScrollThenResizeStable = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "storeName",
        label: "Store Name",
        width: 200,
        type: "string",
      },
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "squareFootage", label: "Sq Ft", width: 150, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createStoreData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      autoExpandColumns: true,
      columnResizing: true,
    });
    wrapper.style.width = "100%";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const bodyMain = canvasElement.querySelector(
      ".st-body-main",
    ) as HTMLElement;
    if (bodyMain && bodyMain.scrollWidth > bodyMain.clientWidth) {
      bodyMain.scrollLeft = 50;
      bodyMain.dispatchEvent(new Event("scroll", { bubbles: true }));
    }
    const idHeader = findHeaderCellByLabel(canvasElement, "ID");
    if (idHeader) {
      await resizeColumn(idHeader, 20, () =>
        findHeaderCellByLabel(canvasElement, "ID"),
      );
    }
    const headerCells = getHeaderCells(canvasElement);
    headerCells.forEach((c) => {
      const w = parsePixelWidth(getColumnWidth(c));
      expect(Number.isNaN(w)).toBe(false);
      expect(w).toBeGreaterThan(0);
    });
  },
};

// ============================================================================
// 6. EDGE CASES
// ============================================================================

export const AutoExpandSingleColumn = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, type: "string" },
    ];
    return renderWithWidth(
      headers,
      createEmployeeData(),
      {
        autoExpandColumns: true,
        height: "400px",
      },
      "100%",
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(1);
    const w = parsePixelWidth(getColumnWidth(headerCells[0]));
    const container = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    expect(Math.abs(w - (container?.clientWidth ?? 600))).toBeLessThanOrEqual(
      WIDTH_TOLERANCE,
    );
  },
};

export const AutoExpandAllPinnedNoMain = {
  render: () => {
    const headers: HeaderObject[] = [
      {
        accessor: "id",
        label: "ID",
        width: 80,
        pinned: "left",
        type: "number",
      },
      {
        accessor: "name",
        label: "Name",
        width: 150,
        pinned: "left",
        type: "string",
      },
      {
        accessor: "salary",
        label: "Salary",
        width: 120,
        pinned: "right",
        type: "number",
      },
      {
        accessor: "projects",
        label: "Projects",
        width: 100,
        pinned: "right",
        type: "number",
      },
    ];
    return renderWithWidth(
      headers,
      createEmployeeData(),
      {
        autoExpandColumns: true,
        height: "400px",
      },
      "100%",
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const sections = getHeaderSections(canvasElement);
    expect(sections.left).toBeTruthy();
    expect(sections.right).toBeTruthy();
    const leftCells = getHeaderCellsInSection(sections.left);
    const rightCells = getHeaderCellsInSection(sections.right);
    expect(leftCells.length).toBe(2);
    expect(rightCells.length).toBe(2);
    const mainCells = getHeaderCellsInSection(sections.main);
    expect(mainCells.length).toBe(0);
  },
};

export const AutoExpandContainerResizeTriggersRescale = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      {
        accessor: "department",
        label: "Department",
        width: 150,
        type: "string",
      },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      autoExpandColumns: true,
    });
    wrapper.style.width = "600px";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const tableContainer = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    if (!tableContainer) return;
    const widthBefore = tableContainer.clientWidth;
    const wrapperEl = canvasElement.firstElementChild as HTMLElement;
    if (wrapperEl) wrapperEl.style.width = "900px";
    await new Promise((r) => setTimeout(r, 300));
    const headerCells = getHeaderCells(canvasElement);
    const totalW = headerCells.reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    const widthAfter = tableContainer.clientWidth;
    if (widthAfter > widthBefore) {
      expect(totalW).toBeGreaterThan(widthBefore - WIDTH_TOLERANCE);
    }
  },
};

export const AutoExpandDisabledNoExpand = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      {
        accessor: "department",
        label: "Department",
        width: 150,
        type: "string",
      },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    return renderWithWidth(
      headers,
      createEmployeeData(),
      {
        autoExpandColumns: false,
        height: "400px",
      },
      "100%",
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);
    const idWidth = parsePixelWidth(getColumnWidth(headerCells[0]));
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    expect(idWidth).toBeGreaterThanOrEqual(55);
    expect(idWidth).toBeLessThanOrEqual(70);
    expect(nameWidth).toBeGreaterThanOrEqual(195);
    expect(nameWidth).toBeLessThanOrEqual(210);
    const totalW = headerCells.reduce(
      (s, c) => s + parsePixelWidth(getColumnWidth(c)),
      0,
    );
    expect(totalW).toBeLessThan(1000);
  },
};
