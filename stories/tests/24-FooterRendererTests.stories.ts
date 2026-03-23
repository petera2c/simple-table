/**
 * FOOTER RENDERER TESTS
 * Tests for table footer: default footer with pagination, hideFooter.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/24 - Footer Renderer",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Tests for table footer: default footer with pagination info and navigation, hideFooter.",
      },
    },
  },
};

export default meta;

const createData = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 150, type: "string" },
];

export const DefaultFooterWithPagination = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(25), {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      shouldPaginate: true,
      rowsPerPage: 10,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const footer = canvasElement.querySelector(".st-footer");
    expect(footer).toBeTruthy();
    expect(footer?.querySelector(".st-footer-info")).toBeTruthy();
    expect(footer?.querySelector(".st-footer-results-text")).toBeTruthy();
    expect(footer?.textContent).toMatch(/Showing \d+ to \d+ of \d+ results/);
    expect(footer?.querySelector(".st-footer-pagination")).toBeTruthy();
    expect(footer?.querySelectorAll(".st-page-btn").length).toBeGreaterThan(0);
  },
};

export const FooterShowsCorrectRange = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(15), {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      shouldPaginate: true,
      rowsPerPage: 5,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const resultsText = canvasElement.querySelector(".st-footer-results-text");
    expect(resultsText?.textContent).toContain("Showing 1 to 5 of 15 results");
  },
};

export const HideFooterHidesFooter = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(10), {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      shouldPaginate: true,
      rowsPerPage: 5,
      hideFooter: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const footer = canvasElement.querySelector(".st-footer");
    expect(footer).toBeFalsy();
  },
};

export const NoPaginationNoFooter = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(10), {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      shouldPaginate: false,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const footer = canvasElement.querySelector(".st-footer");
    expect(footer).toBeFalsy();
  },
};

// ============================================================================
// STANDARD FOOTER NAVIGATION (page count display)
// ============================================================================

export const FooterShowsCorrectPageCount = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(25), {
      getRowId: (p) => String(p.row?.id),
      height: "350px",
      shouldPaginate: true,
      rowsPerPage: 10,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const footer = canvasElement.querySelector(".st-footer");
    expect(footer).toBeTruthy();
    // 25 rows / 10 per page = 3 pages — footer should mention page count
    expect(footer?.textContent).toContain("3");
  },
};

export const FooterPrevDisabledOnFirstPage = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(20), {
      getRowId: (p) => String(p.row?.id),
      height: "350px",
      shouldPaginate: true,
      rowsPerPage: 10,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const footer = canvasElement.querySelector(".st-footer");
    expect(footer).toBeTruthy();
    // On the first page the prev button should be disabled
    const prevBtn = footer?.querySelector<HTMLButtonElement>("button");
    expect(prevBtn).toBeTruthy();
    expect(prevBtn?.disabled).toBe(true);
  },
};
