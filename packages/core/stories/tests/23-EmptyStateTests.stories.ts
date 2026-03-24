/**
 * EMPTY STATE TESTS
 * Tests for tableEmptyStateRenderer when table has no rows.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/23 - Empty State",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Tests for tableEmptyStateRenderer: custom content when table has no rows.",
      },
    },
  },
};

export default meta;

const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 150, type: "string" },
];

export const EmptyStateDefaultMessage = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, [], {
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const emptyWrapper = canvasElement.querySelector(".st-empty-state-wrapper");
    expect(emptyWrapper).toBeTruthy();
    const defaultMessage = canvasElement.querySelector(".st-empty-state");
    expect(defaultMessage?.textContent?.trim()).toBe("No rows to display");
  },
};

export const EmptyStateCustomString = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, [], {
      height: "300px",
      tableEmptyStateRenderer: "No results found. Try adjusting your filters.",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const emptyWrapper = canvasElement.querySelector(".st-empty-state-wrapper");
    expect(emptyWrapper).toBeTruthy();
    expect(emptyWrapper?.textContent?.trim()).toContain(
      "No results found. Try adjusting your filters."
    );
  },
};

export const EmptyStateCustomElement = {
  render: () => {
    const customEl = document.createElement("div");
    customEl.className = "custom-empty-message";
    customEl.textContent = "Custom empty state content";
    const { wrapper } = renderVanillaTable(headers, [], {
      height: "300px",
      tableEmptyStateRenderer: customEl,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const emptyWrapper = canvasElement.querySelector(".st-empty-state-wrapper");
    expect(emptyWrapper).toBeTruthy();
    const customContent = emptyWrapper?.querySelector(".custom-empty-message");
    expect(customContent).toBeTruthy();
    expect(customContent?.textContent?.trim()).toBe("Custom empty state content");
  },
};

export const WithDataNoEmptyState = {
  render: () => {
    const data = [{ id: 1, name: "Only row" }];
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      tableEmptyStateRenderer: "This should not show",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const emptyWrapper = canvasElement.querySelector(".st-empty-state-wrapper");
    expect(emptyWrapper).toBeFalsy();
    expect(canvasElement.textContent).toContain("Only row");
  },
};
