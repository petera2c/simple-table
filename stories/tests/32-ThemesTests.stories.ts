/**
 * THEMES TESTS
 * Tests for SimpleTable theme prop (light, dark, sky, violet, etc.).
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/32 - Themes",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Tests for theme prop: root has correct theme class.",
      },
    },
  },
};

export default meta;

const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 120, type: "string" },
];
const data = () => [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

export const ThemeLight = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "light",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("theme-light")).toBe(true);
  },
};

export const ThemeDark = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "dark",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("theme-dark")).toBe(true);
  },
};

export const ThemeSky = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "sky",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("theme-sky")).toBe(true);
  },
};

export const ThemeViolet = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "violet",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("theme-violet")).toBe(true);
  },
};

export const ThemeModernLight = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "modern-light",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("theme-modern-light")).toBe(true);
  },
};
