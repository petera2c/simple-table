/**
 * NESTED HEADERS TESTS (non-collapsible)
 * Headers with children but no collapsible: multiple header rows and column span.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/38 - Nested Headers",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Tests for nested headers without collapsible: multiple header rows and column span.",
      },
    },
  },
};

export default meta;

const getHeaderCells = (canvasElement: HTMLElement): HTMLElement[] => {
  const container = canvasElement.querySelector(
    ".st-header-main, .st-header-container"
  );
  if (!container) return [];
  return Array.from(container.querySelectorAll(".st-header-cell"));
};

const getHeaderRowCount = (canvasElement: HTMLElement): number => {
  const cells = getHeaderCells(canvasElement);
  const tops = new Set(
    cells.map(
      (c) =>
        c.style.top ||
        (c.getAttribute("style")?.match(/top:\s*([\d.]+px?)/)?.[1] ?? "0")
    )
  );
  return tops.size;
};

const getVisibleLeafColumnCount = (canvasElement: HTMLElement): number => {
  const body = canvasElement.querySelector(".st-body-main, .st-body-container");
  if (!body) return 0;
  const firstRowCells = body.querySelectorAll('.st-cell[data-row-index="0"]');
  return firstRowCells.length;
};

const data = () => [
  { id: 1, a: "A1", b: "B1" },
  { id: 2, a: "A2", b: "B2" },
];

export const NestedHeadersMultipleRows = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      {
        accessor: "group1",
        label: "Group",
        width: 200,
        children: [
          { accessor: "a", label: "A", width: 100, type: "string" },
          { accessor: "b", label: "B", width: 100, type: "string" },
        ],
      },
    ];
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const rowCount = getHeaderRowCount(canvasElement);
    expect(rowCount).toBeGreaterThanOrEqual(2);
    const leafCount = getVisibleLeafColumnCount(canvasElement);
    expect(leafCount).toBe(3);
    expect(canvasElement.textContent).toContain("Group");
    expect(canvasElement.textContent).toContain("A");
    expect(canvasElement.textContent).toContain("B");
  },
};

export const NestedHeadersColumnSpan = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      {
        accessor: "parent",
        label: "Parent",
        width: 240,
        children: [
          { accessor: "col1", label: "Col1", width: 120, type: "string" },
          { accessor: "col2", label: "Col2", width: 120, type: "string" },
        ],
      },
    ];
    const rows = () => [
      { id: 1, col1: "X", col2: "Y" },
      { id: 2, col1: "P", col2: "Q" },
    ];
    const { wrapper } = renderVanillaTable(headers, rows(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    const parentCell = headerCells.find(
      (c) =>
        c.querySelector(".st-header-label-text")?.textContent?.trim() === "Parent"
    ) as HTMLElement | undefined;
    expect(parentCell).toBeTruthy();
    const parentWidth = parentCell
      ? parseFloat(parentCell.style.width) || parentCell.offsetWidth
      : 0;
    expect(parentWidth).toBeGreaterThanOrEqual(200);
    expect(getVisibleLeafColumnCount(canvasElement)).toBe(3);
  },
};
