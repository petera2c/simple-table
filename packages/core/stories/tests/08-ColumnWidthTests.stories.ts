/**
 * COLUMN WIDTH TESTS
 * Ported from React - same tests, vanilla table only.
 */

import { HeaderObject, Row } from "../../src/index";
import { expect } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/08-ColumnWidthTests",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Comprehensive tests for column width including fixed width, flexible width, and resize behavior.",
      },
    },
  },
};

export default meta;

const createEmployeeData = () => [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", department: "Engineering", salary: 120000 },
  { id: 2, name: "Bob Smith", email: "bob@example.com", department: "Design", salary: 95000 },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", department: "Engineering", salary: 140000 },
  { id: 4, name: "Diana Prince", email: "diana@example.com", department: "Marketing", salary: 110000 },
  { id: 5, name: "Eve Adams", email: "eve@example.com", department: "Sales", salary: 105000 },
];

const getHeaderCells = (canvasElement: HTMLElement) => Array.from(canvasElement.querySelectorAll(".st-header-cell"));
const getColumnWidth = (headerCell: Element) => window.getComputedStyle(headerCell).width;
const parsePixelWidth = (widthString: string) => parseFloat(String(widthString).replace("px", ""));
const getTableRoot = (canvasElement: HTMLElement) =>
  canvasElement.querySelector(".st-table-root") || canvasElement.querySelector(".simple-table-root") || canvasElement.querySelector(".st-body-container");

function renderWithWidth(
  headers: HeaderObject[],
  data: Row[],
  options: Record<string, unknown> = {},
  wrapperWidth: string | null = null
) {
  const { wrapper } = renderVanillaTable(headers, data, {
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    height: "400px",
    ...options,
  });
  if (wrapperWidth) wrapper.style.width = wrapperWidth;
  return wrapper;
}

export const FixedPixelWidths = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    return renderWithWidth(headers, createEmployeeData());
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);
    const idWidth = parsePixelWidth(getColumnWidth(headerCells[0]));
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    const salaryWidth = parsePixelWidth(getColumnWidth(headerCells[3]));
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

export const AutoSizingWithOneFr = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: "1fr", type: "string" },
      { accessor: "email", label: "Email", width: "1fr", type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
    ];
    return renderWithWidth(headers, createEmployeeData(), {}, "800px");
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const emailWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    const ratio = nameWidth / emailWidth;
    expect(ratio).toBeGreaterThan(0.9);
    expect(ratio).toBeLessThan(1.1);
    expect(nameWidth).toBeGreaterThan(60);
    expect(emailWidth).toBeGreaterThan(60);
  },
};

export const MinWidthConstraint = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: "1fr", minWidth: 200, type: "string" },
      { accessor: "email", label: "Email", width: "1fr", minWidth: 250, type: "string" },
      { accessor: "department", label: "Department", width: "1fr", minWidth: 150, type: "string" },
    ];
    return renderWithWidth(headers, createEmployeeData(), {}, "600px");
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const emailWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[3]));
    expect(nameWidth).toBeGreaterThanOrEqual(195);
    expect(emailWidth).toBeGreaterThanOrEqual(245);
    expect(deptWidth).toBeGreaterThanOrEqual(145);
  },
};

export const MaxWidthConstraint = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: "1fr", maxWidth: 200, type: "string" },
      { accessor: "email", label: "Email", width: "1fr", type: "string" },
    ];
    return renderWithWidth(headers, createEmployeeData(), {}, "1200px");
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const emailWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    expect(nameWidth).toBeGreaterThan(0);
    expect(emailWidth).toBeGreaterThan(0);
    expect(emailWidth).toBeGreaterThanOrEqual(nameWidth * 0.8);
  },
};

export const AutoExpandColumnsBasic = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    return renderWithWidth(headers, createEmployeeData(), { autoExpandColumns: true }, "1000px");
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);
    const idWidth = parsePixelWidth(getColumnWidth(headerCells[0]));
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    const salaryWidth = parsePixelWidth(getColumnWidth(headerCells[3]));
    expect(nameWidth).toBeGreaterThan(deptWidth);
    expect(deptWidth).toBeGreaterThan(salaryWidth);
    expect(salaryWidth).toBeGreaterThan(idWidth);
    const totalWidth = idWidth + nameWidth + deptWidth + salaryWidth;
    expect(totalWidth).toBeGreaterThan(950);
  },
};

export const AutoExpandColumnsIgnoresMinWidth = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: 100, minWidth: 300, type: "string" },
      { accessor: "department", label: "Department", width: 100, minWidth: 300, type: "string" },
      { accessor: "salary", label: "Salary", width: 100, minWidth: 300, type: "number" },
    ];
    return renderWithWidth(headers, createEmployeeData(), { autoExpandColumns: true }, "600px");
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    const salaryWidth = parsePixelWidth(getColumnWidth(headerCells[3]));
    expect(nameWidth).toBeLessThan(300);
    expect(deptWidth).toBeLessThan(300);
    expect(salaryWidth).toBeLessThan(300);
    const avgWidth = (nameWidth + deptWidth + salaryWidth) / 3;
    expect(nameWidth).toBeGreaterThan(avgWidth * 0.9);
    expect(nameWidth).toBeLessThan(avgWidth * 1.1);
  },
};

export const AutoExpandColumnsIgnoresMaxWidth = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 200, maxWidth: 100, type: "number" },
      { accessor: "name", label: "Name", width: 200, maxWidth: 100, type: "string" },
      { accessor: "department", label: "Department", width: 200, maxWidth: 100, type: "string" },
    ];
    return renderWithWidth(headers, createEmployeeData(), { autoExpandColumns: true }, "1200px");
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);
    const idWidth = parsePixelWidth(getColumnWidth(headerCells[0]));
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    expect(idWidth).toBeGreaterThan(100);
    expect(nameWidth).toBeGreaterThan(100);
    expect(deptWidth).toBeGreaterThan(100);
    const avgWidth = (idWidth + nameWidth + deptWidth) / 3;
    expect(idWidth).toBeGreaterThan(avgWidth * 0.9);
    expect(idWidth).toBeLessThan(avgWidth * 1.1);
  },
};

export const MixedWidthStrategies = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: "1fr", minWidth: 150, type: "string" },
      { accessor: "email", label: "Email", width: "1fr", minWidth: 200, type: "string" },
      { accessor: "department", label: "Department", width: 120, type: "string" },
      { accessor: "salary", label: "Salary", width: 100, type: "number" },
    ];
    return renderWithWidth(headers, createEmployeeData(), {}, "900px");
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(5);
    const idWidth = parsePixelWidth(getColumnWidth(headerCells[0]));
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const emailWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[3]));
    const salaryWidth = parsePixelWidth(getColumnWidth(headerCells[4]));
    expect(idWidth).toBeGreaterThanOrEqual(55);
    expect(idWidth).toBeLessThanOrEqual(65);
    expect(deptWidth).toBeGreaterThanOrEqual(115);
    expect(deptWidth).toBeLessThanOrEqual(125);
    expect(salaryWidth).toBeGreaterThanOrEqual(95);
    expect(salaryWidth).toBeLessThanOrEqual(105);
    expect(nameWidth).toBeGreaterThanOrEqual(145);
    expect(emailWidth).toBeGreaterThanOrEqual(195);
    expect(nameWidth).toBeGreaterThan(idWidth);
    expect(emailWidth).toBeGreaterThan(deptWidth);
  },
};

export const GridTemplateColumnsFormat = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: "1fr", minWidth: 120, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
    ];
    return renderWithWidth(headers, createEmployeeData());
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBeGreaterThanOrEqual(3);
    const idWidth = parsePixelWidth(getColumnWidth(headerCells[0]));
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    expect(idWidth).toBeGreaterThanOrEqual(55);
    expect(idWidth).toBeLessThanOrEqual(65);
    expect(nameWidth).toBeGreaterThanOrEqual(115);
    expect(deptWidth).toBeGreaterThanOrEqual(145);
    expect(deptWidth).toBeLessThanOrEqual(155);
  },
};

export const NarrowContainerBehavior = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: "1fr", minWidth: 150, type: "string" },
      { accessor: "department", label: "Department", width: "1fr", minWidth: 150, type: "string" },
    ];
    return renderWithWidth(headers, createEmployeeData(), {}, "300px");
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    expect(nameWidth).toBeGreaterThanOrEqual(145);
    expect(deptWidth).toBeGreaterThanOrEqual(145);
    const tableRoot = getTableRoot(canvasElement);
    if (tableRoot) {
      expect(tableRoot.scrollWidth).toBeGreaterThanOrEqual(tableRoot.clientWidth);
    }
  },
};

export const WideContainerBehavior = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: "1fr", type: "number" },
      { accessor: "name", label: "Name", width: "1fr", type: "string" },
      { accessor: "department", label: "Department", width: "1fr", type: "string" },
    ];
    return renderWithWidth(headers, createEmployeeData(), {}, "1600px");
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);
    const idWidth = parsePixelWidth(getColumnWidth(headerCells[0]));
    const nameWidth = parsePixelWidth(getColumnWidth(headerCells[1]));
    const deptWidth = parsePixelWidth(getColumnWidth(headerCells[2]));
    const avgWidth = (idWidth + nameWidth + deptWidth) / 3;
    expect(idWidth).toBeGreaterThan(avgWidth * 0.9);
    expect(idWidth).toBeLessThan(avgWidth * 1.1);
    expect(nameWidth).toBeGreaterThan(avgWidth * 0.9);
    expect(nameWidth).toBeLessThan(avgWidth * 1.1);
    expect(deptWidth).toBeGreaterThan(avgWidth * 0.9);
    expect(deptWidth).toBeLessThan(avgWidth * 1.1);
    expect(idWidth).toBeGreaterThan(400);
    expect(nameWidth).toBeGreaterThan(400);
    expect(deptWidth).toBeGreaterThan(400);
  },
};
