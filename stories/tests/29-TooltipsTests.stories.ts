/**
 * TOOLTIPS TESTS
 * Tests for HeaderObject.tooltip - header tooltip (title and optional custom tooltip).
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
        component: "Tests for header tooltip: title attribute and tooltip content.",
      },
    },
  },
};

export default meta;

const createData = () => [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

export const HeaderTooltipTitleAttribute = {
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
    const elementWithTitle = canvasElement.querySelector(
      '[title="Full name of the person"]'
    );
    expect(elementWithTitle).toBeTruthy();
    expect(canvasElement.textContent).toContain("Name");
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
    const withTooltip = canvasElement.querySelector(".st-header-label [title]");
    expect(withTooltip).toBeFalsy();
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
    expect(canvasElement.querySelector('[title="Unique identifier"]')).toBeTruthy();
    expect(canvasElement.querySelector('[title="Display name"]')).toBeTruthy();
  },
};
