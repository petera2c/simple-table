/**
 * CUSTOM ICONS TESTS
 * Tests for SimpleTable icons prop (sortUp, sortDown, expand, prev, next, etc.).
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/34 - Custom Icons",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Tests for icons prop: custom sort, expand, and pagination icons.",
      },
    },
  },
};

export default meta;

const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 150, type: "string", isSortable: true },
];
const data = () => [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

export const CustomSortIcons = {
  render: () => {
    const sortUpEl = document.createElement("span");
    sortUpEl.className = "custom-sort-up-icon";
    sortUpEl.setAttribute("data-testid", "sort-up");
    const sortDownEl = document.createElement("span");
    sortDownEl.className = "custom-sort-down-icon";
    sortDownEl.setAttribute("data-testid", "sort-down");
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      icons: { sortUp: sortUpEl, sortDown: sortDownEl },
      initialSortColumn: "name",
      initialSortDirection: "asc",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const sortUp = canvasElement.querySelector(".custom-sort-up-icon");
    const sortDown = canvasElement.querySelector(".custom-sort-down-icon");
    expect(sortUp || sortDown).toBeTruthy();
  },
};

export const CustomExpandIcon = {
  render: () => {
    const expandEl = document.createElement("span");
    expandEl.className = "custom-expand-icon";
    expandEl.setAttribute("data-testid", "expand");
    const groupHeaders: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, expandable: true, type: "string" },
      { accessor: "id", label: "ID", width: 80, type: "number" },
    ];
    const groupData = [
      { id: "g1", name: "Group A", items: [{ id: 1, name: "Item 1" }] },
    ];
    const { wrapper } = renderVanillaTable(groupHeaders, groupData, {
      getRowId: (p) => String((p.row as { id?: string })?.id),
      height: "250px",
      rowGrouping: ["items"],
      expandAll: false,
      icons: { expand: expandEl },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const customExpand = canvasElement.querySelector(".custom-expand-icon");
    expect(customExpand).toBeTruthy();
  },
};

export const CustomPaginationIcons = {
  render: () => {
    const prevEl = document.createElement("span");
    prevEl.className = "custom-prev-icon";
    const nextEl = document.createElement("span");
    nextEl.className = "custom-next-icon";
    const { wrapper } = renderVanillaTable(headers, [...data(), { id: 3, name: "Carol" }], {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      shouldPaginate: true,
      rowsPerPage: 2,
      icons: { prev: prevEl, next: nextEl },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const prevIcon = canvasElement.querySelector(".custom-prev-icon");
    const nextIcon = canvasElement.querySelector(".custom-next-icon");
    expect(prevIcon || nextIcon).toBeTruthy();
  },
};
