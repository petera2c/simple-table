/**
 * VALUE FORMATTER TESTS
 * Tests for HeaderObject.valueFormatter - formatted display without custom cellRenderer.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/27 - Value Formatter",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Tests for valueFormatter: formatted cell display (e.g. currency, dates).",
      },
    },
  },
};

export default meta;

const createData = () => [
  { id: 1, name: "Alice", price: 19.99, pct: 0.85 },
  { id: 2, name: "Bob", price: 42.5, pct: 0.92 },
];

export const ValueFormatterCurrency = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 120, type: "string" },
      {
        accessor: "price",
        label: "Price",
        width: 120,
        type: "number",
        valueFormatter: ({ value }) => `$${(value as number).toFixed(2)}`,
      },
    ];
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.textContent).toContain("$19.99");
    expect(canvasElement.textContent).toContain("$42.50");
  },
};

export const ValueFormatterPercentage = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "pct",
        label: "Completion",
        width: 120,
        type: "number",
        valueFormatter: ({ value }) => `${((value as number) * 100).toFixed(0)}%`,
      },
    ];
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.textContent).toContain("85%");
    expect(canvasElement.textContent).toContain("92%");
  },
};

export const NoFormatterShowsRawValue = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.textContent).toContain("19.99");
    expect(canvasElement.textContent).toContain("42.5");
  },
};
