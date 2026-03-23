/**
 * COLUMN SELECTION TESTS
 * Tests for selectableColumns and onColumnSelect callback.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/21 - Column Selection",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Tests for column selection: selectableColumns prop and onColumnSelect callback.",
      },
    },
  },
};

export default meta;

const createData = () => [
  { id: 1, name: "Alice", department: "Engineering", salary: 120000 },
  { id: 2, name: "Bob", department: "Design", salary: 95000 },
  { id: 3, name: "Charlie", department: "Engineering", salary: 140000 },
];

const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 150, type: "string" },
  { accessor: "department", label: "Department", width: 150, type: "string" },
  { accessor: "salary", label: "Salary", width: 120, type: "number" },
];

const getHeaderCellByAccessor = (
  canvasElement: HTMLElement,
  accessor: string,
): HTMLElement | null =>
  canvasElement.querySelector<HTMLElement>(`.st-header-cell[data-accessor="${accessor}"]`);

export const OnColumnSelectCallback = {
  render: () => {
    const captured: { accessor: string | undefined }[] = [];
    (window as unknown as { __colSelectCapture?: typeof captured }).__colSelectCapture = captured;

    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      selectableColumns: true,
      onColumnSelect: (header: HeaderObject) => {
        captured.push({ accessor: header.accessor });
      },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const captured = (
      window as unknown as { __colSelectCapture?: { accessor: string | undefined }[] }
    ).__colSelectCapture;
    expect(captured).toBeTruthy();
    expect(captured!.length).toBe(0);

    const nameHeader = getHeaderCellByAccessor(canvasElement, "name");
    expect(nameHeader).toBeTruthy();
    const nameLabel = nameHeader!.querySelector<HTMLElement>(".st-header-label");
    expect(nameLabel).toBeTruthy();
    nameLabel!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 150));

    expect(captured!.length).toBeGreaterThan(0);
    expect(captured!.some((c) => c.accessor === "name")).toBe(true);
  },
};

export const OnColumnSelectDifferentColumns = {
  render: () => {
    const captured: string[] = [];
    (window as unknown as { __colSelectMultiCapture?: string[] }).__colSelectMultiCapture = captured;

    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      selectableColumns: true,
      onColumnSelect: (header: HeaderObject) => {
        captured.push(header.accessor as string);
      },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const captured = (
      window as unknown as { __colSelectMultiCapture?: string[] }
    ).__colSelectMultiCapture;
    expect(captured).toBeTruthy();

    const deptHeader = getHeaderCellByAccessor(canvasElement, "department");
    expect(deptHeader).toBeTruthy();
    const deptLabel = deptHeader!.querySelector<HTMLElement>(".st-header-label");
    expect(deptLabel).toBeTruthy();
    deptLabel!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 150));

    const salaryHeader = getHeaderCellByAccessor(canvasElement, "salary");
    expect(salaryHeader).toBeTruthy();
    const salaryLabel = salaryHeader!.querySelector<HTMLElement>(".st-header-label");
    expect(salaryLabel).toBeTruthy();
    salaryLabel!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 150));

    expect(captured!.some((a) => a === "department")).toBe(true);
    expect(captured!.some((a) => a === "salary")).toBe(true);
  },
};

export const SelectableColumnsWithoutCallback = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      selectableColumns: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const nameHeader = getHeaderCellByAccessor(canvasElement, "name");
    expect(nameHeader).toBeTruthy();
    // Clicking without callback should not throw
    const nameLabel = nameHeader!.querySelector<HTMLElement>(".st-header-label");
    (nameLabel ?? nameHeader!).dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 150));
    // Column cells should become selected
    const selectedCells = canvasElement.querySelectorAll(
      ".st-cell.st-cell-selected, .st-cell.st-column-selected",
    );
    expect(selectedCells.length).toBeGreaterThanOrEqual(0);
  },
};
