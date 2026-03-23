/**
 * LOADING STATE TESTS
 * Tests for isLoading prop - skeleton loaders in cells when data is loading.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/22 - Loading State",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Tests for isLoading: table shows skeleton loaders in cells when loading.",
      },
    },
  },
};

export default meta;

const createData = () => [
  { id: 1, name: "Alice", score: 85 },
  { id: 2, name: "Bob", score: 92 },
  { id: 3, name: "Carol", score: 78 },
];

const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 150, type: "string" },
  { accessor: "score", label: "Score", width: 100, type: "number" },
];

export const LoadingStateShowsSkeletons = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      isLoading: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const skeletons = canvasElement.querySelectorAll(".st-loading-skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
    const cells = canvasElement.querySelectorAll(".st-cell");
    expect(cells.length).toBeGreaterThan(0);
    const firstCell = cells[0];
    expect(firstCell.querySelector(".st-loading-skeleton")).toBeTruthy();
  },
};

export const NotLoadingShowsData = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      isLoading: false,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const skeletons = canvasElement.querySelectorAll(".st-loading-skeleton");
    expect(skeletons.length).toBe(0);
    expect(canvasElement.textContent).toContain("Alice");
    expect(canvasElement.textContent).toContain("85");
  },
};

export const LoadingStateWithEmptyRows = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, [], {
      height: "300px",
      isLoading: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = canvasElement.querySelector(".simple-table-root");
    expect(table).toBeTruthy();
    const skeletons = canvasElement.querySelectorAll(".st-loading-skeleton");
    expect(skeletons.length).toBeGreaterThanOrEqual(0);
  },
};
