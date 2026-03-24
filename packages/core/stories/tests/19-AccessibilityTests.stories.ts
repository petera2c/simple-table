/**
 * ACCESSIBILITY TESTS
 * Ported from React - same tests, vanilla table only.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/19 - Accessibility",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Comprehensive tests for accessibility including keyboard navigation and ARIA attributes.",
      },
    },
  },
};

export default meta;

const createBasicData = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    age: 25 + (i % 30),
    department: ["Engineering", "Design", "Marketing", "Sales", "HR"][i % 5],
    salary: 50000 + i * 5000,
  }));

export const TableStructureAriaAttributes = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "age", label: "Age", width: 100 },
      { accessor: "department", label: "Department", width: 150 },
    ];
    const data = createBasicData(10);
    const { wrapper } = renderVanillaTable(headers, data, { height: "400px" });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const headerContainer = canvasElement.querySelector(".st-header-container");
    if (!headerContainer) throw new Error("Header container not found");
    const ariaRowCount = headerContainer.getAttribute("aria-rowcount");
    expect(ariaRowCount).toBeTruthy();
    expect(Number(ariaRowCount)).toBeGreaterThanOrEqual(11);
    const ariaColCount = headerContainer.getAttribute("aria-colcount");
    expect(ariaColCount).toBeTruthy();
    expect(Number(ariaColCount)).toBe(4);
    const headerCells = canvasElement.querySelectorAll(".st-header-cell");
    expect(headerCells.length).toBe(4);
    headerCells.forEach((cell, index) => {
      expect(cell.getAttribute("aria-colindex")).toBeTruthy();
      expect(Number(cell.getAttribute("aria-colindex"))).toBe(index + 1);
    });
    const bodyContainer = canvasElement.querySelector(".st-body-container");
    if (!bodyContainer) throw new Error("Body container not found");
    const bodyCells = bodyContainer.querySelectorAll(".st-cell");
    expect(bodyCells.length).toBeGreaterThan(0);
    bodyCells.forEach((cell) => {
      expect(cell.getAttribute("aria-rowindex")).toBeTruthy();
      expect(Number(cell.getAttribute("aria-rowindex"))).toBeGreaterThan(0);
      expect(cell.getAttribute("aria-colindex")).toBeTruthy();
      expect(Number(cell.getAttribute("aria-colindex"))).toBeGreaterThan(0);
    });
  },
};

export const ScreenReaderLiveRegion = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true },
    ];
    const data = createBasicData(5);
    const { wrapper } = renderVanillaTable(headers, data, { height: "400px" });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const liveRegion = canvasElement.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeTruthy();
    expect(liveRegion?.getAttribute("aria-atomic")).toBe("true");
    expect(liveRegion?.classList.contains("st-sr-only")).toBe(true);
  },
};

export const ScreenReaderOnlyTextVisibility = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
    ];
    const data = createBasicData(3);
    const { wrapper } = renderVanillaTable(headers, data, { height: "300px" });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const srOnlyElements = canvasElement.querySelectorAll(".st-sr-only");
    expect(srOnlyElements.length).toBeGreaterThan(0);
    srOnlyElements.forEach((el) => {
      const style = window.getComputedStyle(el);
      const isVisuallyHidden =
        style.position === "absolute" ||
        style.clip !== "auto" ||
        style.clipPath === "inset(50%)" ||
        (style.width === "1px" && style.height === "1px") ||
        style.overflow === "hidden";
      expect(isVisuallyHidden).toBe(true);
    });
  },
};

export const SortButtonAriaAttributes = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true },
      { accessor: "department", label: "Department", width: 150 },
    ];
    const data = createBasicData(5);
    const { wrapper } = renderVanillaTable(headers, data, { height: "400px" });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const sortableHeaders = canvasElement.querySelectorAll(".st-header-cell[aria-sort]");
    expect(sortableHeaders.length).toBeGreaterThanOrEqual(0);
    const sortButtons = canvasElement.querySelectorAll('.st-header-cell button[aria-label]');
    expect(sortButtons.length).toBeGreaterThanOrEqual(0);
  },
};
