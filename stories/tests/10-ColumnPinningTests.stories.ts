/**
 * COLUMN PINNING TESTS
 * Ported from React - same tests, vanilla table only.
 */

import { SimpleTableVanilla } from "../../dist/index.es.js";
import { expect } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/10-ColumnPinningTests",
  parameters: { layout: "padded" },
};

export default meta;

const createEmployeeData = () => [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", department: "Engineering", position: "Senior Engineer", salary: 120000, startDate: "2020-01-15", projects: 5 },
  { id: 2, name: "Bob Smith", email: "bob@example.com", department: "Design", position: "Lead Designer", salary: 95000, startDate: "2019-03-22", projects: 3 },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", department: "Engineering", position: "Staff Engineer", salary: 140000, startDate: "2018-07-10", projects: 8 },
  { id: 4, name: "Diana Prince", email: "diana@example.com", department: "Marketing", position: "Marketing Manager", salary: 110000, startDate: "2021-05-01", projects: 4 },
  { id: 5, name: "Eve Adams", email: "eve@example.com", department: "Sales", position: "Sales Director", salary: 105000, startDate: "2020-09-15", projects: 6 },
];

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

const getFlexShrink = (element: Element | null) => (element ? window.getComputedStyle(element as HTMLElement).flexShrink : "");

const hasBorder = (element: Element | null, side: "left" | "right") => {
  if (!element) return false;
  const style = window.getComputedStyle(element as HTMLElement);
  const borderProp = side === "left" ? style.borderLeftWidth : style.borderRightWidth;
  return parseFloat(borderProp) > 0;
};

function renderPinned(width = "600px") {
  return (headers: Record<string, unknown>[], data: Record<string, unknown>[], options: Record<string, unknown> = {}) => {
    const { wrapper } = renderVanillaTable(headers, data, { getRowId: (params) => String(params.row?.id), ...options });
    wrapper.style.width = width;
    return wrapper;
  };
}

export const LeftPinnedColumn = {
  render: () => {
    const headers = [
      { accessor: "name", label: "Name", width: 150, pinned: "left", type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    return renderPinned("600px")(headers, createEmployeeData(), { height: "400px" });
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerSections = getHeaderSections(canvasElement);
    expect(headerSections.left).toBeTruthy();
    const leftHeaderCells = getHeaderCellsInSection(headerSections.left);
    expect(leftHeaderCells.length).toBe(1);
    const mainHeaderCells = getHeaderCellsInSection(headerSections.main);
    expect(mainHeaderCells.length).toBe(3);
    expect(headerSections.right).toBeNull();
    expect(getFlexShrink(headerSections.left)).toBe("0");
    expect(hasBorder(headerSections.left, "right")).toBe(true);
  },
};

export const RightPinnedColumn = {
  render: () => {
    const headers = [
      { accessor: "name", label: "Name", width: 150, type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "projects", label: "Projects", width: 100, pinned: "right", type: "number" },
    ];
    return renderPinned("600px")(headers, createEmployeeData(), { height: "400px" });
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerSections = getHeaderSections(canvasElement);
    expect(headerSections.right).toBeTruthy();
    const rightHeaderCells = getHeaderCellsInSection(headerSections.right);
    expect(rightHeaderCells.length).toBe(1);
    const mainHeaderCells = getHeaderCellsInSection(headerSections.main);
    expect(mainHeaderCells.length).toBe(3);
    expect(headerSections.left).toBeNull();
    expect(getFlexShrink(headerSections.right)).toBe("0");
    expect(hasBorder(headerSections.right, "left")).toBe(true);
  },
};

export const BothLeftAndRightPinned = {
  render: () => {
    const headers = [
      { accessor: "name", label: "Name", width: 150, pinned: "left", type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
      { accessor: "projects", label: "Projects", width: 100, pinned: "right", type: "number" },
    ];
    return renderPinned("700px")(headers, createEmployeeData(), { height: "400px" });
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerSections = getHeaderSections(canvasElement);
    expect(headerSections.left).toBeTruthy();
    expect(headerSections.main).toBeTruthy();
    expect(headerSections.right).toBeTruthy();
    expect(getHeaderCellsInSection(headerSections.left).length).toBe(1);
    expect(getHeaderCellsInSection(headerSections.main).length).toBe(3);
    expect(getHeaderCellsInSection(headerSections.right).length).toBe(1);
    expect(getFlexShrink(headerSections.left)).toBe("0");
    expect(getFlexShrink(headerSections.right)).toBe("0");
    expect(hasBorder(headerSections.left, "right")).toBe(true);
    expect(hasBorder(headerSections.right, "left")).toBe(true);
  },
};

export const MultipleLeftPinnedColumns = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 60, pinned: "left", type: "number" },
      { accessor: "name", label: "Name", width: 150, pinned: "left", type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    return renderPinned("700px")(headers, createEmployeeData(), { height: "400px" });
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerSections = getHeaderSections(canvasElement);
    const leftHeaderCells = getHeaderCellsInSection(headerSections.left);
    expect(leftHeaderCells.length).toBe(2);
    expect(getHeaderCellsInSection(headerSections.main).length).toBe(3);
    expect(leftHeaderCells[0].textContent).toContain("ID");
    expect(leftHeaderCells[1].textContent).toContain("Name");
  },
};

export const MultipleRightPinnedColumns = {
  render: () => {
    const headers = [
      { accessor: "name", label: "Name", width: 150, type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, pinned: "right", type: "number" },
      { accessor: "projects", label: "Projects", width: 100, pinned: "right", type: "number" },
    ];
    return renderPinned("700px")(headers, createEmployeeData(), { height: "400px" });
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerSections = getHeaderSections(canvasElement);
    const rightHeaderCells = getHeaderCellsInSection(headerSections.right);
    expect(rightHeaderCells.length).toBe(2);
    expect(getHeaderCellsInSection(headerSections.main).length).toBe(3);
    expect(rightHeaderCells[0].textContent).toContain("Salary");
    expect(rightHeaderCells[1].textContent).toContain("Projects");
  },
};

export const PinnedColumnsWithBodySections = {
  render: () => {
    const headers = [
      { accessor: "name", label: "Name", width: 150, pinned: "left", type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "projects", label: "Projects", width: 100, pinned: "right", type: "number" },
    ];
    return renderPinned("600px")(headers, createEmployeeData(), { height: "400px" });
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerSections = getHeaderSections(canvasElement);
    const bodySections = getBodySections(canvasElement);
    expect(headerSections.left).toBeTruthy();
    expect(headerSections.main).toBeTruthy();
    expect(headerSections.right).toBeTruthy();
    expect(bodySections.left).toBeTruthy();
    expect(bodySections.main).toBeTruthy();
    expect(bodySections.right).toBeTruthy();
    expect(getFlexShrink(bodySections.left)).toBe("0");
    expect(getFlexShrink(bodySections.right)).toBe("0");
    expect(hasBorder(bodySections.left, "right")).toBe(true);
    expect(hasBorder(bodySections.right, "left")).toBe(true);
  },
};

export const PinnedColumnsWithSorting = {
  render: () => {
    const headers = [
      { accessor: "name", label: "Name", width: 150, pinned: "left", isSortable: true, type: "string" },
      { accessor: "email", label: "Email", width: 200, isSortable: true, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, pinned: "right", isSortable: true, type: "number" },
    ];
    return renderPinned("600px")(headers, createEmployeeData(), { height: "400px" });
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerSections = getHeaderSections(canvasElement);
    const leftHeaderCells = getHeaderCellsInSection(headerSections.left);
    const rightHeaderCells = getHeaderCellsInSection(headerSections.right);
    expect(leftHeaderCells.length).toBe(1);
    expect(rightHeaderCells.length).toBe(1);
    expect(leftHeaderCells[0].classList.contains("clickable")).toBe(true);
    expect(rightHeaderCells[0].classList.contains("clickable")).toBe(true);
  },
};

export const PinnedColumnsWithFiltering = {
  render: () => {
    const headers = [
      { accessor: "name", label: "Name", width: 150, pinned: "left", filterable: true, type: "string" },
      { accessor: "email", label: "Email", width: 200, filterable: true, type: "string" },
      { accessor: "projects", label: "Projects", width: 100, pinned: "right", filterable: true, type: "number" },
    ];
    return renderPinned("600px")(headers, createEmployeeData(), { height: "400px" });
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerSections = getHeaderSections(canvasElement);
    expect(headerSections.left).toBeTruthy();
    expect(headerSections.right).toBeTruthy();
    const leftHeaderCells = getHeaderCellsInSection(headerSections.left);
    const rightHeaderCells = getHeaderCellsInSection(headerSections.right);
    expect(leftHeaderCells.length).toBe(1);
    expect(rightHeaderCells.length).toBe(1);
    expect(leftHeaderCells[0]).toBeTruthy();
    expect(rightHeaderCells[0]).toBeTruthy();
  },
};

export const NoPinnedColumns = {
  render: () => {
    const headers = [
      { accessor: "name", label: "Name", width: 150, type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
    ];
    return renderPinned("600px")(headers, createEmployeeData(), { height: "400px" });
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerSections = getHeaderSections(canvasElement);
    expect(headerSections.main).toBeTruthy();
    expect(headerSections.left).toBeNull();
    expect(headerSections.right).toBeNull();
    expect(getHeaderCellsInSection(headerSections.main).length).toBe(3);
  },
};

export const PinnedColumnsWithAlignment = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 60, pinned: "left", align: "center", type: "number" },
      { accessor: "name", label: "Name", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, pinned: "right", align: "right", type: "number" },
    ];
    return renderPinned("600px")(headers, createEmployeeData(), { height: "400px" });
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerSections = getHeaderSections(canvasElement);
    const leftHeaderCells = getHeaderCellsInSection(headerSections.left);
    const rightHeaderCells = getHeaderCellsInSection(headerSections.right);
    expect(leftHeaderCells.length).toBe(1);
    expect(rightHeaderCells.length).toBe(1);
    const leftHeaderLabel = leftHeaderCells[0].querySelector(".st-header-label-text");
    expect(leftHeaderLabel?.classList.contains("center-aligned")).toBe(true);
    const rightHeaderLabel = rightHeaderCells[0].querySelector(".st-header-label-text");
    expect(rightHeaderLabel?.classList.contains("right-aligned")).toBe(true);
  },
};
