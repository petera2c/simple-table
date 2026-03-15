/**
 * HIDE HEADER / FOOTER TESTS
 * Tests for hideHeader and hideFooter props.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/35 - Hide Header and Footer",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Tests for hideHeader and hideFooter: header/footer hidden, table still works.",
      },
    },
  },
};

export default meta;

const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 150, type: "string" },
];
const data = () => [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Carol" },
];

export const HideHeader = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      hideHeader: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const headerCells = canvasElement.querySelectorAll(".st-header-cell");
    expect(headerCells.length).toBe(0);
    const bodyCells = canvasElement.querySelectorAll(".st-cell[data-accessor='name']");
    expect(bodyCells.length).toBeGreaterThan(0);
    expect(canvasElement.textContent).toContain("Alice");
  },
};

export const HideFooter = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      shouldPaginate: true,
      rowsPerPage: 2,
      hideFooter: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const footer = canvasElement.querySelector(".st-footer");
    expect(footer).toBeFalsy();
    expect(canvasElement.textContent).toContain("Alice");
  },
};

export const HideHeaderWithSorting = {
  render: () => {
    const sortableHeaders: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number", isSortable: true },
      { accessor: "name", label: "Name", width: 150, type: "string", isSortable: true },
    ];
    const { wrapper } = renderVanillaTable(sortableHeaders, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      hideHeader: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const headerCells = canvasElement.querySelectorAll(".st-header-cell");
    expect(headerCells.length).toBe(0);
    const bodyCells = canvasElement.querySelectorAll(".st-cell");
    expect(bodyCells.length).toBeGreaterThan(0);
  },
};
