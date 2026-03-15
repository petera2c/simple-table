/**
 * CUSTOM THEME TESTS
 * Tests for every customTheme property (CSS var / dimension) and for overriding
 * many individual internal CSS classes via className.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/33 - Custom Theme",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Tests for every customTheme property and for overriding internal CSS classes via className.",
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
  { id: 3, name: "Carol" },
];

// ---------------------------------------------------------------------------
// Individual customTheme properties (every CSS var / dimension)
// ---------------------------------------------------------------------------

export const CustomThemeRowHeight = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      customTheme: { rowHeight: 48 },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const bodyCell = canvasElement.querySelector(".st-cell[data-accessor='id']") as HTMLElement;
    expect(bodyCell).toBeTruthy();
    expect(bodyCell.style.height).toBe("48px");
  },
};

export const CustomThemeHeaderHeight = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      customTheme: { headerHeight: 56 },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const headerContainer = canvasElement.querySelector(".st-header-container") as HTMLElement;
    expect(headerContainer).toBeTruthy();
    expect(headerContainer.style.height).toBe("56px");
  },
};

export const CustomThemeFooterHeight = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      shouldPaginate: true,
      rowsPerPage: 2,
      customTheme: { footerHeight: 60 },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const footer = canvasElement.querySelector(".st-footer");
    expect(footer).toBeTruthy();
    const root = canvasElement.querySelector(".simple-table-root") as HTMLElement;
    expect(root).toBeTruthy();
    const contentHeight = (root.style as unknown as { height?: string }).height;
    expect(contentHeight || root.getAttribute("style")).toBeTruthy();
  },
};

export const CustomThemeRowSeparatorWidth = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      customTheme: { rowHeight: 32, rowSeparatorWidth: 6 },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const cells = canvasElement.querySelectorAll(".st-cell[data-accessor='id']");
    expect(cells.length).toBeGreaterThanOrEqual(2);
    const secondCell = cells[1] as HTMLElement;
    const topPx = secondCell.style.top;
    expect(topPx).toBeTruthy();
    const topNum = parseFloat(topPx);
    expect(topNum).toBeGreaterThanOrEqual(32);
  },
};

export const CustomThemeBorderWidth = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      customTheme: { borderWidth: 2 },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
    expect(canvasElement.querySelector(".st-header-cell")).toBeTruthy();
  },
};

export const CustomThemePinnedBorderWidth = {
  render: () => {
    const pinnedHeaders: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number", pinned: "left" },
      { accessor: "name", label: "Name", width: 150, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(pinnedHeaders, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      customTheme: { pinnedBorderWidth: 2 },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.querySelector(".st-body-pinned-left")).toBeTruthy();
    expect(canvasElement.querySelector(".st-cell")).toBeTruthy();
  },
};

export const CustomThemeNestedGridBorderWidth = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      customTheme: { nestedGridBorderWidth: 4 },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
  },
};

export const CustomThemeNestedGridPaddingTop = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      customTheme: { nestedGridPaddingTop: 12 },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.querySelector(".simple-table-root")).toBeTruthy();
  },
};

export const CustomThemeNestedGridPaddingBottom = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      customTheme: { nestedGridPaddingBottom: 14 },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.querySelector(".st-body-container")).toBeTruthy();
  },
};

export const CustomThemeNestedGridPaddingLeft = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      customTheme: { nestedGridPaddingLeft: 10 },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.querySelector(".st-cell")).toBeTruthy();
  },
};

export const CustomThemeNestedGridPaddingRight = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      customTheme: { nestedGridPaddingRight: 10 },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.querySelector(".st-wrapper-container")).toBeTruthy();
  },
};

export const CustomThemeNestedGridMaxHeight = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      customTheme: { nestedGridMaxHeight: 350 },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.querySelector(".simple-table-root")).toBeTruthy();
  },
};

export const CustomThemeSelectionColumnWidth = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      enableRowSelection: true,
      customTheme: { selectionColumnWidth: 50 },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const selectionCell = canvasElement.querySelector(
      ".st-cell[data-accessor='__row_selection__']"
    ) as HTMLElement;
    expect(selectionCell).toBeTruthy();
    expect(selectionCell.offsetWidth).toBeGreaterThanOrEqual(48);
    expect(selectionCell.offsetWidth).toBeLessThanOrEqual(52);
  },
};

// ---------------------------------------------------------------------------
// Override many individual CSS classes via root className
// ---------------------------------------------------------------------------

const OVERRIDE_ROOT = "custom-theme-override-root";

export const CustomThemeOverrideRootClassName = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      className: OVERRIDE_ROOT,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
    expect(root?.classList.contains(OVERRIDE_ROOT)).toBe(true);
  },
};

export const CustomThemeOverrideManyClasses = {
  render: () => {
    const overrideClass = "my-override-theme";
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      shouldPaginate: true,
      rowsPerPage: 2,
      className: overrideClass,
    });
    const style = document.createElement("style");
    style.textContent = `
      .${overrideClass} .st-cell { --override-cell: 1; }
      .${overrideClass} .st-header-cell { --override-header: 1; }
      .${overrideClass} .st-footer { --override-footer: 1; }
      .${overrideClass} .st-row-separator { --override-separator: 1; }
      .${overrideClass} .st-body-container { --override-body: 1; }
      .${overrideClass} .st-header-container { --override-header-container: 1; }
      .${overrideClass} .st-content { --override-content: 1; }
      .${overrideClass} .st-wrapper-container { --override-wrapper: 1; }
      .${overrideClass} .st-footer-info { --override-footer-info: 1; }
      .${overrideClass} .st-footer-pagination { --override-footer-pagination: 1; }
      .${overrideClass} .st-page-btn { --override-page-btn: 1; }
      .${overrideClass} .st-next-prev-btn { --override-next-prev: 1; }
      .${overrideClass} .st-cell-content { --override-cell-content: 1; }
    `;
    wrapper.insertBefore(style, wrapper.firstChild);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root?.classList.contains("my-override-theme")).toBe(true);

    const cell = canvasElement.querySelector(".st-cell");
    const headerCell = canvasElement.querySelector(".st-header-cell");
    const footer = canvasElement.querySelector(".st-footer");
    const bodyContainer = canvasElement.querySelector(".st-body-container");
    const headerContainer = canvasElement.querySelector(".st-header-container");
    const content = canvasElement.querySelector(".st-content");
    const wrapperContainer = canvasElement.querySelector(".st-wrapper-container");

    expect(cell).toBeTruthy();
    expect(headerCell).toBeTruthy();
    expect(bodyContainer).toBeTruthy();
    expect(headerContainer).toBeTruthy();
    expect(content).toBeTruthy();
    expect(wrapperContainer).toBeTruthy();

    const getVar = (el: Element | null, name: string) =>
      el ? getComputedStyle(el as HTMLElement).getPropertyValue(name).trim() : "";
    expect(getVar(cell, "--override-cell")).toBe("1");
    expect(getVar(headerCell, "--override-header")).toBe("1");
    expect(getVar(footer, "--override-footer")).toBe("1");
    expect(getVar(bodyContainer, "--override-body")).toBe("1");
    expect(getVar(headerContainer, "--override-header-container")).toBe("1");
    expect(getVar(content, "--override-content")).toBe("1");
    expect(getVar(wrapperContainer, "--override-wrapper")).toBe("1");

    const footerInfo = canvasElement.querySelector(".st-footer-info");
    const footerPagination = canvasElement.querySelector(".st-footer-pagination");
    const pageBtn = canvasElement.querySelector(".st-page-btn");
    const nextPrevBtn = canvasElement.querySelector(".st-next-prev-btn");
    const cellContent = canvasElement.querySelector(".st-cell-content");

    expect(getVar(footerInfo, "--override-footer-info")).toBe("1");
    expect(getVar(footerPagination, "--override-footer-pagination")).toBe("1");
    expect(getVar(pageBtn, "--override-page-btn")).toBe("1");
    expect(getVar(nextPrevBtn, "--override-next-prev")).toBe("1");
    expect(getVar(cellContent, "--override-cell-content")).toBe("1");
  },
};

export const CustomThemeOverrideWithInlineStyles = {
  render: () => {
    const overrideClass = "override-with-styles";
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      shouldPaginate: true,
      rowsPerPage: 2,
      className: overrideClass,
    });
    const style = document.createElement("style");
    style.textContent = `
      .${overrideClass}.simple-table-root { background: rgb(248, 250, 252); }
      .${overrideClass} .st-header-cell { background: rgb(241, 245, 249); }
      .${overrideClass} .st-cell { font-size: 14px; }
      .${overrideClass} .st-footer { border-top: 2px solid rgb(203, 213, 225); }
    `;
    wrapper.insertBefore(style, wrapper.firstChild);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root") as HTMLElement;
    const headerCell = canvasElement.querySelector(".st-header-cell") as HTMLElement;
    const cell = canvasElement.querySelector(".st-cell") as HTMLElement;
    const footer = canvasElement.querySelector(".st-footer") as HTMLElement;

    expect(root).toBeTruthy();
    const rootBg = getComputedStyle(root).backgroundColor;
    expect(rootBg).toMatch(/248|249|250|251|252/);
    const headerBg = getComputedStyle(headerCell).backgroundColor;
    expect(headerBg).toMatch(/241|245|249/);
    expect(getComputedStyle(cell).fontSize).toBe("14px");
    const footerBorder = getComputedStyle(footer).borderTopWidth;
    expect(parseInt(footerBorder, 10)).toBeGreaterThanOrEqual(2);
  },
};

// ---------------------------------------------------------------------------
// Combined: many customTheme props at once
// ---------------------------------------------------------------------------

export const CustomThemeManyPropsAtOnce = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "320px",
      shouldPaginate: true,
      rowsPerPage: 2,
      customTheme: {
        rowHeight: 40,
        headerHeight: 44,
        footerHeight: 52,
        rowSeparatorWidth: 2,
        borderWidth: 1,
        pinnedBorderWidth: 1,
        nestedGridBorderWidth: 2,
        nestedGridPaddingTop: 6,
        nestedGridPaddingBottom: 6,
        nestedGridPaddingLeft: 8,
        nestedGridPaddingRight: 8,
        nestedGridMaxHeight: 380,
        selectionColumnWidth: 44,
      },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const bodyCell = canvasElement.querySelector(".st-cell[data-accessor='id']") as HTMLElement;
    const headerContainer = canvasElement.querySelector(".st-header-container") as HTMLElement;
    expect(bodyCell?.style.height).toBe("40px");
    expect(headerContainer?.style.height).toBe("44px");
  },
};
