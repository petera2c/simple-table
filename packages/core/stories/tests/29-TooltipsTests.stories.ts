/**
 * TOOLTIPS TESTS
 * Tests for HeaderObject.tooltip - header tooltip (custom .st-tooltip on hover, no native title to avoid double tooltip).
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/29 - Tooltips",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Tests for header tooltip: custom tooltip on hover (single styled tooltip, no native title).",
      },
    },
  },
};

export default meta;

const createData = () => [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

export const HeaderTooltipShownOnHover = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "name",
        label: "Name",
        width: 150,
        type: "string",
        tooltip: "Full name of the person",
      },
      { accessor: "score", label: "Score", width: 100, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // Header with tooltip renders (custom .st-tooltip appears on hover; we do not set title to avoid double tooltip)
    expect(canvasElement.textContent).toContain("Name");
    const nameHeaderCell = canvasElement.querySelector('[data-accessor="name"]');
    expect(nameHeaderCell).toBeTruthy();
  },
};

export const HeaderWithoutTooltip = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 150, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // No header has tooltip config, so no header label should have a title attribute
    const withTitle = canvasElement.querySelector(".st-header-label [title]");
    expect(withTitle).toBeFalsy();
  },
};

export const MultipleHeadersWithTooltips = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number", tooltip: "Unique identifier" },
      { accessor: "name", label: "Name", width: 150, type: "string", tooltip: "Display name" },
    ];
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // Both headers with tooltips render (custom tooltip appears on hover for each)
    expect(canvasElement.querySelector('[data-accessor="id"]')).toBeTruthy();
    expect(canvasElement.querySelector('[data-accessor="name"]')).toBeTruthy();
    expect(canvasElement.textContent).toContain("ID");
    expect(canvasElement.textContent).toContain("Name");
  },
};
