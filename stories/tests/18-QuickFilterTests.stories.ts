/**
 * QUICK FILTER TESTS
 * Ported from React - same tests, vanilla table only.
 */

import type { Meta } from "@storybook/html";
import { expect, userEvent } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/18 - Quick Filter",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Comprehensive tests for quick filter (global search) and filter behavior.",
      },
    },
  },
};

export default meta;

const createTestData = () => [
  { id: 1, name: "Alice Johnson", age: 28, email: "alice.johnson@example.com", department: "Engineering", status: "Active", location: "New York" },
  { id: 2, name: "Bob Smith", age: 35, email: "bob.smith@example.com", department: "Sales", status: "Active", location: "Los Angeles" },
  { id: 3, name: "Charlie Davis", age: 42, email: "charlie.davis@example.com", department: "Engineering", status: "Active", location: "San Francisco" },
  { id: 4, name: "Diana Prince", age: 31, email: "diana.prince@example.com", department: "Marketing", status: "Inactive", location: "Chicago" },
  { id: 5, name: "Ethan Hunt", age: 29, email: "ethan.hunt@example.com", department: "Sales", status: "Active", location: "Boston" },
  { id: 6, name: "Fiona Green", age: 38, email: "fiona.green@example.com", department: "Engineering", status: "Active", location: "Seattle" },
  { id: 7, name: "George Wilson", age: 26, email: "george.wilson@example.com", department: "Marketing", status: "Active", location: "Austin" },
  { id: 8, name: "Hannah Lee", age: 33, email: "hannah.lee@example.com", department: "Sales", status: "Inactive", location: "Denver" },
];

const getVisibleRowCount = (canvasElement: HTMLElement): number => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return 0;
  const cells = bodyContainer.querySelectorAll(".st-cell[data-row-index]");
  const unique = new Set(Array.from(cells).map((c) => c.getAttribute("data-row-index")));
  return unique.size;
};

const getColumnData = (canvasElement: HTMLElement, accessor: string): string[] => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return [];
  const cells = bodyContainer.querySelectorAll(`[data-accessor="${accessor}"]`);
  return Array.from(cells)
    .map((c) => c.querySelector(".st-cell-content")?.textContent?.trim() || "")
    .filter((t) => t.length > 0);
};

let quickFilterTableInstance: InstanceType<typeof import("../../src/index").SimpleTableVanilla> | null = null;

export const BasicQuickFilterSimpleMode = {
  render: () => {
    const data = createTestData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 180 },
      { accessor: "age", label: "Age", width: 80 },
      { accessor: "department", label: "Department", width: 140 },
      { accessor: "email", label: "Email", width: 220 },
    ];
    const { wrapper, tableContainer, table } = renderVanillaTable(headers, data, {
      height: "400px",
      quickFilter: { text: "", mode: "simple" },
    });
    quickFilterTableInstance = table;
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Search across all columns...";
    input.setAttribute("data-testid", "quick-filter-input");
    input.style.width = "100%";
    input.style.padding = "10px";
    input.style.marginBottom = "1rem";
    input.addEventListener("input", () => {
      quickFilterTableInstance?.update({ quickFilter: { text: input.value, mode: "simple" } });
    });
    wrapper.insertBefore(input, tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    expect(getVisibleRowCount(canvasElement)).toBe(8);
    const input = canvasElement.querySelector('input[data-testid="quick-filter-input"]') as HTMLInputElement;
    if (!input) throw new Error("Search input not found");
    await user.clear(input);
    await user.type(input, "engineering");
    await new Promise((r) => setTimeout(r, 500));
    expect(getVisibleRowCount(canvasElement)).toBe(3);
    const deptData = getColumnData(canvasElement, "department");
    deptData.forEach((dept) => expect(dept).toBe("Engineering"));
    await user.clear(input);
    await user.type(input, "alice");
    await new Promise((r) => setTimeout(r, 500));
    expect(getVisibleRowCount(canvasElement)).toBe(1);
    const nameData = getColumnData(canvasElement, "name");
    expect(nameData[0]).toContain("Alice");
    await user.clear(input);
    await new Promise((r) => setTimeout(r, 500));
    expect(getVisibleRowCount(canvasElement)).toBe(8);
  },
};

export const SmartModeMultiWord = {
  render: () => {
    const data = createTestData();
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 180 },
      { accessor: "department", label: "Department", width: 140 },
      { accessor: "status", label: "Status", width: 100 },
    ];
    const { wrapper, tableContainer, table } = renderVanillaTable(headers, data, {
      height: "400px",
      quickFilter: { text: "", mode: "smart" },
    });
    quickFilterTableInstance = table;
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Try: engineering active";
    input.setAttribute("data-testid", "smart-filter-input");
    input.style.width = "100%";
    input.style.padding = "10px";
    input.style.marginBottom = "1rem";
    input.addEventListener("input", () => {
      quickFilterTableInstance?.update({ quickFilter: { text: input.value, mode: "smart" } });
    });
    wrapper.insertBefore(input, tableContainer);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    const input = canvasElement.querySelector('input[data-testid="smart-filter-input"]') as HTMLInputElement;
    if (!input) throw new Error("Smart filter input not found");
    await user.clear(input);
    await user.type(input, "engineering active");
    await new Promise((r) => setTimeout(r, 500));
    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(3);
    const deptData = getColumnData(canvasElement, "department");
    deptData.forEach((d) => expect(d).toBe("Engineering"));
  },
};
